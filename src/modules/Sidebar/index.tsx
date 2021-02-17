import React from "react"
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../store";
import { mapActions } from "../Content/components/Map/redux/actions";
import { Header, Preloader, Records, Form } from "./components";
import { sidebarActions } from "./components/redux/actions";
import { FetchStatus } from "./components/redux/const";
import "./index.css"

const mapStateToProps = (state: RootState) => {
    return { ...state.map, ...state.sidebar }
}

const mapDispatch = {
    setSelectedRegion: mapActions.setSelectedRegion,
    setIsSidebarClosing: sidebarActions.setIsSidebarClosing,
    fetchRecordsByIso: sidebarActions.fetchRecordsByIso,
    setRecords: sidebarActions.setRecords
}
const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;


const Sidebar: React.FC<Props> = ({ records, selectedRegion, isAnimating, fetchStatus, setRecords, fetchRecordsByIso, setSelectedRegion, setIsSidebarClosing }) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const openedTransitionEndHandler = React.useCallback(() => {
        setOpened(true);
        if (contentRef.current)
            contentRef.current.removeEventListener("transitionend", openedTransitionEndHandler);
    }, []);

    const closedTransitionEndHandler = React.useCallback(() => {
        if (contentRef.current) {
            contentRef.current.removeEventListener("transitionend", closedTransitionEndHandler)
        }
        setSelectedRegion(null);
        setRecords(null);
    }, [setSelectedRegion, setRecords]);

    const handleClose = React.useCallback(() => {
        if (contentRef.current) {
            setOpened(false);
            contentRef.current.classList.remove("content_desktop", "content_mobile");
            contentRef.current.classList.add("hidden");

            setIsSidebarClosing(true);
            contentRef.current.addEventListener("transitionend", closedTransitionEndHandler)
        }
    }, [closedTransitionEndHandler, setIsSidebarClosing]);

    React.useEffect(() => {
        const div = contentRef.current;
        if (!div || isAnimating) return;

        div.addEventListener("transitionend", openedTransitionEndHandler)

        return () => {
            if (div) {
                div.removeEventListener("transitionend", openedTransitionEndHandler);
                div.removeEventListener("transitionend", closedTransitionEndHandler);
            }
        }
    }, [selectedRegion, isAnimating, openedTransitionEndHandler, closedTransitionEndHandler]);

    const resizeAndLoadHandler = React.useCallback(() => {
        if (!contentRef.current) return;
        let elem = document.documentElement;
        if (elem.clientWidth < elem.clientHeight
            && !contentRef.current.classList.contains("content_mobile")) {
            contentRef.current.classList.add("content_mobile");
            contentRef.current.classList.remove("content_desktop");
        }
        else if (elem.clientWidth > elem.clientHeight
            && !contentRef.current.classList.contains("content_desktop")) {
            contentRef.current.classList.add("content_desktop");
            contentRef.current.classList.remove("content_mobile");
        }
    }, [])

    React.useEffect(() => {
        window.addEventListener("resize", resizeAndLoadHandler);
    });


    React.useEffect(() => {
        if (selectedRegion && !isAnimating) {
            resizeAndLoadHandler();
        }
    }, [selectedRegion, isAnimating, resizeAndLoadHandler])

    if (selectedRegion && !isAnimating) {
        return (
            <div
                ref={contentRef}
                className="content"
            >
                <Header
                    opened={opened && records !== null}
                    handleClose={handleClose}
                />
                {
                    records && opened && <>
                        <div className="inner_content">
                            <div className="pages">
                                <Records records={records} />
                            </div>
                        </div>
                        <Form />
                    </>
                }
                {fetchStatus === FetchStatus.loading && opened && <Preloader overlay />}
                {fetchStatus === FetchStatus.failure && opened && (
                    <div className="d-flex justify-content-center align-items-center w-100 h-100 error text-center" >
                        <h2 className="text-center w-100">500 Internal Error. Failed to fetch data</h2>
                    </div >
                )}
            </div>
        )
    }
    return (
        <div className="content hidden" ></div>
    );
}

export default connector(Sidebar);

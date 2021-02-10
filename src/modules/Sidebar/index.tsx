import React from "react"
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../store";
import { mapActions } from "../Content/components/Map/redux/actions";
import { Header } from "./components";
import { sidebarActions } from "./components/redux/actions";
import "./index.css"

const mapStateToProps = (state: RootState) => {
    return { ...state.map, ...state.sidebar };
}

const mapDispatch = {
    setSelectedPath: mapActions.setSelectedPath,
    setIsSidebarClosing: sidebarActions.setIsSidebarClosing
}
const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;

export enum FormType {
    create = "Create Data",
    edit = "Edit Data",
}

const Sidebar: React.FC<Props> = ({ selectedPath, isAnimating, setSelectedPath, setIsSidebarClosing }) => {
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
        setSelectedPath(null);
    }, [setSelectedPath]);

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
        let div = contentRef.current;
        if (!div || !selectedPath || isAnimating) return;

        div.addEventListener("transitionend", openedTransitionEndHandler)

        return () => {
            if (div) {
                div.removeEventListener("transitionend", openedTransitionEndHandler);
                div.removeEventListener("transitionend", closedTransitionEndHandler);
            }
        }
    }, [selectedPath, isAnimating, openedTransitionEndHandler, closedTransitionEndHandler]);

    if (selectedPath && !isAnimating) {
        return (
            <div
                ref={contentRef}
                className={
                    ["content",
                        `content_${document.documentElement.clientWidth < document.documentElement.clientHeight
                            ? "mobile"
                            : "desktop"}`].join(" ")}
            >

                <Header
                    opened={opened}
                    title={selectedPath.getAttribute("name")}
                    handleClose={handleClose}
                />
            </div>
        )
    }
    return (
        <div className="content hidden" ></div>
    );
}

export default connector(Sidebar);

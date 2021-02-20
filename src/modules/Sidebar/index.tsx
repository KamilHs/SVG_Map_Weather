import React from "react"
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../store";
import { mapActions } from "../Content/components/Map/redux/actions";
import { Header, Preloader, Records, Form, Statistics } from "./components";
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

interface ISlideData {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    totalDx: number;
    prevDx: number;
    prevTransform: number;
    activePage: ActivePage;
}

enum ActivePage {
    records,
    stats,
}

const Sidebar: React.FC<Props> = ({ records, selectedRegion, isAnimating, fetchStatus, setRecords, fetchRecordsByIso, setSelectedRegion, setIsSidebarClosing }) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const pagesRef = React.useRef<HTMLDivElement>(null);
    const slideDataRef = React.useRef<ISlideData>({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        totalDx: 0,
        prevDx: 0,
        prevTransform: 0,
        activePage: ActivePage.records,
    });

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

    const slideToActivePage = React.useCallback(() => {
        if (!pagesRef.current) return;
        let { activePage } = slideDataRef.current;
        pagesRef.current.style.transform = `translateX(calc(-${50 * activePage}% - ${activePage * 0.8}rem))`;
    }, []);

    const handlePageSwipe = React.useCallback(() => {
        if (!pagesRef.current) return;

        let { activePage } = slideDataRef.current;
        slideDataRef.current.activePage = activePage === ActivePage.records
            ? ActivePage.stats
            : ActivePage.records;
        slideToActivePage();
    }, [slideToActivePage])

    const handleTouchStart = React.useCallback((e: TouchEvent) => {
        if (!pagesRef.current) return;
        if (pagesRef.current.style.transform) {
            let style: CSSStyleDeclaration = window.getComputedStyle(pagesRef.current);
            let matrix = new WebKitCSSMatrix(style.transform);
            slideDataRef.current.prevTransform = matrix.m41;
        }
        slideDataRef.current.startX = e.touches[0].clientX;
        slideDataRef.current.startY = e.touches[0].clientY;
    }, []);
    const handleTouchMove = React.useCallback((e: TouchEvent) => {
        if (!pagesRef.current) return;
        slideDataRef.current.endX = e.touches[0].clientX;
        slideDataRef.current.endY = e.touches[0].clientY;

        let dx = slideDataRef.current.endX - slideDataRef.current.startX;
        let dy = slideDataRef.current.endY - slideDataRef.current.startY;
        let { activePage } = slideDataRef.current;

        if (dx > 0 && activePage === ActivePage.records) return;
        if (dx < 0 && activePage === ActivePage.stats) return;
        if (Math.abs(dy) > Math.abs(dx)) return;

        let sign = dx >= 0 ? 1 : -1;

        slideDataRef.current.totalDx += Math.abs(slideDataRef.current.prevDx - dx) * sign;
        if (Math.abs(slideDataRef.current.totalDx) >= pagesRef.current.clientWidth / 5) {
            slideDataRef.current.totalDx = 0;
            slideDataRef.current.prevDx = 0;
            handlePageSwipe();
            return;
        }
        pagesRef.current.style.transform = `translateX(${slideDataRef.current.prevTransform + slideDataRef.current.totalDx}px)`;
        slideDataRef.current.prevDx = dx;
    }, [handlePageSwipe]);
    const handleTouchEnd = React.useCallback((e: TouchEvent) => {
        if (!pagesRef.current) return;

        slideDataRef.current.totalDx = 0;
        slideDataRef.current.prevDx = 0;
        slideToActivePage();
    }, [slideToActivePage]);

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
        let div = pagesRef.current;
        if (!div) return;
        div.addEventListener("touchstart", handleTouchStart);
        div.addEventListener("touchmove", handleTouchMove);
        div.addEventListener("touchend", handleTouchEnd);
        return () => {
            if (!div) return;
            div.removeEventListener("touchstart", handleTouchStart);
            div.removeEventListener("touchmove", handleTouchMove);
            div.removeEventListener("touchend", handleTouchEnd);
        }
    })

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
                            <div ref={pagesRef} className="pages">
                                <Records />
                                <Statistics />
                            </div>
                            <div className="page-controllers">
                                <button className="page-controller page-controller_left page-controller_active"></button>
                                <button className="page-controller page-controller_right"></button>
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

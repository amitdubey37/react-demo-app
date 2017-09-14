import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dragula from 'react-dragula';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import c from 'classnames';
import pickBy from 'lodash/pickBy';
import grid from '../../utils/grid';
import RuntimeSettingsCard from '../../containers/RuntimeSettingsCard';
import { openWidgetCreator } from '../../actions/runtimeSettings';
import { getRuntimeSettings } from '../../StoreHelper';
import ReportHeader from '../ReportHeader';
import classes from '../../containers/DraggableWidgetContainer/styles.scss';
import { swapWidgetsAndSync } from '../../actions/widgets';
import LoadingIndicator from '../../components/LoadingIndicator';
import styles from './styles.scss';
import Tabs from '../../components/Tabs';
import FiltersAppliedNotification from '../FiltersAppliedNotification';
import { changeFilterDrawerVisibility } from '../../actions/responsive';
import { addTabsToAPI } from '../../actions/tabs/updateTabsAPI';
import { MAX_TABS } from '../../constants';
import NoWidgetFound from '../NoWidgetFound';

class CustomReportContentPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageYOffset: 0,
        };
        this.dragHandlerInstance = '';
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dragulaContainers.length) {
            if (!this.dragHandlerInstance) {
                this.dragHandlerInstance = this.dragHandler(nextProps.dragulaContainers, classes);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    getDragulaInstance() {
        return this.dragHandlerInstance;
    }

    handleScroll() {
        this.setState({ pageYOffset: window.pageYOffset });
    }

    dragHandler(dragulaContainers, classes) {
        const dragulaInstance = Dragula(dragulaContainers, {
            copy: true,
            moves: (el, container, handle) => handle.classList.contains('dragHandle'),
        });

        function mouseMoveHandler(e) {
            const mousePosition = e.pageY - window.pageYOffset;
            const h = window.innerHeight;

            // dividing the screen into 3 parts,
            // and activating scroll once scrolled in the topmost or bottom most region

            const topRegion = h / 3;
            const bottomRegion = h - topRegion;
            let direction = 1;

            if (e.which === 1 &&
                (mousePosition < topRegion ||
                mousePosition > bottomRegion)) {    // e.wich = 1 => click down !
                if (mousePosition < topRegion) {
                    direction = -1;
                }
                // direction * 20 to increase the scroll velocity
                window.scrollTo(0, (direction * 20) + window.pageYOffset);
            }
        }

        dragulaInstance.on('drag', (el) => {
            setTimeout(() => {
                el.classList.add(classes.widgetIsBeingDragged);
            }, 0);

            document.addEventListener('mousemove', mouseMoveHandler);
        });

        dragulaInstance.on('over', (element, container) => {
            const children = Array.from(container.children);
            children.find((child) => {
                if (child.id !== element.id) {
                    child.classList.add(classes.anotherWidgetIsOverMe);
                    return true;
                }
            });
        });

        dragulaInstance.on('dragend', () => {
            Array.from(document.getElementsByClassName(classes.widgetIsBeingDragged)).forEach((element) => {
                element.classList.remove(classes.widgetIsBeingDragged);
            });
            document.removeEventListener('mousemove', mouseMoveHandler);
        });

        dragulaInstance.on('out', (el, container) => {
            Array.from(container.getElementsByClassName(classes.anotherWidgetIsOverMe)).forEach((element) => {
                element.classList.remove(classes.anotherWidgetIsOverMe);
            });
        });

        dragulaInstance.on('drop', (element, target) => {
            element.classList.remove(classes.widgetIsBeingDragged);
            if (target) {
                const dropTarget = target.getElementsByClassName(classes.anotherWidgetIsOverMe)[0];
                dropTarget.classList.remove(classes.anotherWidgetIsOverMe);

                this.props.onWidgetDrop(element.id, dropTarget.id);
                element.parentNode.removeChild(element);
                // target.firstChild.parentNode.removeChild(target.firstChild);
            }
        });
        return dragulaInstance;
    }

    render() {
        const {
            runtimeSettings,
            handleRuntimeDateChange,
            addWidget,
            widgets,
            activeDashboard,
            widgetList,
            isTabView,
            addTab,
            tabList,
            noOfAppliedFilters,
            showFilters,
            tabsContent,
            notifications,
            isSyncing,
        } = this.props;
        const { pageYOffset } = this.state;
        const reportHeaderStyle = c(styles.reportHeader,
            {
                [styles.shadowOnScroll]: pageYOffset,
            });
        const loaderClasses = pick(styles, ['container', 'background']);
        const dashboardContent = tabsContent;
        const dashboardWidgets = isEmpty(activeDashboard) ? [] : activeDashboard.definition.widgets;
        const dashboardHasWidgets = isEmpty(widgetList) ?
            false : dashboardWidgets.some(widgetId => !widgetList[widgetId].isDeleted);
        const loadingIndicator = isSyncing ? <LoadingIndicator loaderClasses={ loaderClasses } /> : null;
        const hasFiltersAppliedClass = c({
            [styles.hasFiltersApplied]: noOfAppliedFilters > 0,
        });
        const addWidgetToReport = !isSyncing&& !isTabView && !dashboardHasWidgets ? <NoWidgetFound /> : null;
        const tabNotifications = pickBy(notifications, { actionType: 'tab', message: 'notification.deleted' });
        const shouldAddTab = tabList.length + Object.keys(tabNotifications).length < MAX_TABS;
        return (
            <div className={ hasFiltersAppliedClass }>
                {
                    noOfAppliedFilters > 0 ?
                        <FiltersAppliedNotification
                            className={ styles.filtersAppliedNotificationWrapper }
                            noOfAppliedFilters={ noOfAppliedFilters }
                            showFilterDrawer={ showFilters }
                        /> : null
                }
                <div className={ reportHeaderStyle } >
                    { isEmpty(activeDashboard) ?
                        null
                        : <div className={ grid('row') } >
                            <ReportHeader
                                activeDashboard={ activeDashboard }
                                addWidget={ addWidget }
                                addTab={ addTab }
                                shouldAddTab={ shouldAddTab }
                            />
                            <RuntimeSettingsCard
                                handleRuntimeSettingChange={ handleRuntimeDateChange }
                                runtimeSettings={ runtimeSettings }
                            />
                        </div>
                    }
                </div>
                <div className={ styles.contentWrapper }>
                    { isTabView
                        ? <Tabs
                            content={ dashboardContent }
                            tabList={ tabList }
                            loadingIndicator={ loadingIndicator }
                        />
                        : <div className={ grid('row') }>
                        { loadingIndicator }
                        { addWidgetToReport }
                        { dashboardContent }
                    </div>
                    }
                </div>
            </div>
        );
    }
}

CustomReportContentPane.defaultProps = {
    activeDashboard: null,
    isTabView: false,
    tabList: [],
    noOfAppliedFilters: 0,
    notifications: [],
};

CustomReportContentPane.propTypes = {
    runtimeSettings: React.PropTypes.object.isRequired,
    handleRuntimeDateChange: React.PropTypes.func.isRequired,
    addWidget: React.PropTypes.func.isRequired,
    widgets: React.PropTypes.array.isRequired,
    activeDashboard: React.PropTypes.object,
    onWidgetDrop: React.PropTypes.func.isRequired,
    isTabView: React.PropTypes.bool.isRequired,
    addTab: React.PropTypes.func.isRequired,
    tabList: React.PropTypes.arrayOf(React.PropTypes.object),
    noOfAppliedFilters: React.PropTypes.number,
    showFilters: React.PropTypes.func.isRequired,
    tabsContent: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.object),
        React.PropTypes.object,
    ]).isRequired,
    widgetList: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.arrayOf(React.PropTypes.object),
};

function mapStateToProps(reduxState) {
    return {
        runtimeSettings: getRuntimeSettings(reduxState),
        noOfAppliedFilters: reduxState.runtimeSettings.noOfAppliedFilters,
        widgetList: reduxState.entities.widgets,
        notifications: getRuntimeSettings(reduxState).notifications,
        isSyncing: reduxState.loadingStatus.isSyncing,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addWidget() {
            dispatch(openWidgetCreator());
        },
        onWidgetDrop: (fromWidgetIdentifier, toWidgetIdentifier) => {
            dispatch(swapWidgetsAndSync(fromWidgetIdentifier, toWidgetIdentifier));
        },
        addTab() {
            dispatch(addTabsToAPI());
        },
        showFilters() {
            dispatch(changeFilterDrawerVisibility(true));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomReportContentPane);

export { CustomReportContentPane as CustomReportContentPaneComponent };

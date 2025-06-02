import React, { Component } from 'react';
import { RenderReport, RetailerPortalStore } from 'Widgets/RetailerPortal';
import { Col, Row } from 'react-bootstrap';
import service from 'Application/services';
import app from 'Application/app';
import * as htmlToImage from 'html-to-image';
import Scrollbar from 'core/scrollbar/scrollbar';
import { getReportTitle, getReportActionType } from 'Widgets/RetailerPortal/util';
import Button from 'Components/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { dateFormats } from 'core/utils'

const DAILY_OFFSET_SLUGS = ['sales', 'sales-summary', 'commissions', 'cashes', 'financial-adjustments'];

class GenericReport extends Component {

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        const withTime =  RetailerPortalStore.REPORTS[props.report].options?.withTime ? RetailerPortalStore.REPORTS[props.report].options['withTime'] : false;
        const withAutoTime =  RetailerPortalStore.REPORTS[props.report].options?.withAutoTime ? RetailerPortalStore.REPORTS[props.report].options['withAutoTime'] : false;

        // Set up initial Date Time 
        const now = new Date();
        let localTimestampStart = now.getTime() / 1000;
        let localTimestampEnd = now.getTime() / 1000;

        // If Autotime is enabled from date gets the start of the day and 
        // If Autotime is enabled to date gets the end of the day 
        if (withAutoTime){
            localTimestampStart = Math.floor(now.setHours(0,0,0,0)/1000);
            localTimestampEnd =  Math.floor(now.setHours(23,59,59,999)/1000);
        }

        this.state = {
            isLoading: false,
            htmlCode: '',
            params: {
                type: RetailerPortalStore.REPORTS[props.report].required.includes('type')
                    ? RetailerPortalStore.REPORTS[props.report].options['type'][0]
                    : null,
                scope: RetailerPortalStore.REPORTS[props.report].required.includes('scope')
                    ? RetailerPortalStore.REPORTS[props.report].options['scope'][0]
                    : null,
                offset: RetailerPortalStore.REPORTS[props.report].required.includes('offset')
                    ? props.offset !== undefined
                        ? props.offset
                        : RetailerPortalStore.REPORTS[props.report].options['offset']
                    : 0,
                fromDate: RetailerPortalStore.REPORTS[props.report].required.includes('fromDate')
                    ? localTimestampStart
                    : 0,
                toDate: RetailerPortalStore.REPORTS[props.report].required.includes('toDate')
                    ? localTimestampEnd
                    : 0,
                withTime,
                withAutoTime
            },
            from: null,
            to: null,
            error: null,
            calendarOpen: false
        };
    }

    async componentDidMount() {
        await this.fetchService();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Scrollbar.renderScrollBars(this.containerRef);
 }

 fetchService = async (params = {}) => {
    /* 1️⃣  Build the next UI-state object */
    const newParams = {
        type        : params.type    ?? this.state.params.type,
        scope       : params.scope   ?? this.state.params.scope,
        offset      : params.offset  >= 0 ? params.offset  : this.state.params.offset,
        fromDate    : params.fromDate >= 0 ? Math.floor(params.fromDate) : Math.floor(this.state.params.fromDate),
        toDate      : params.toDate  >= 0 ? Math.floor(params.toDate)  : Math.floor(this.state.params.toDate),
        withTime    : params.withTime ?? this.state.params.withTime,
        withAutoTime: params.withAutoTime ?? this.state.params.withAutoTime
    };

    this.setState({ isLoading: true, params: newParams, error: null });

    /* 2️⃣  Prepare what we actually send to the backend */
    const { slug } = RetailerPortalStore.REPORTS[this.props.report];
    const requestParams = { slug, ...newParams };

    /* Convert UNIX timestamp → day-offset **only** for DAILY_OFFSET_SLUGS */
    if (
        DAILY_OFFSET_SLUGS.includes(slug) &&
        requestParams.type === 'Day'
    ) {
       
        if (typeof requestParams.offset === 'number' && requestParams.offset > 1e9) {
            const offsetDays = moment()
                .startOf('day')
                .diff(moment.unix(requestParams.offset).startOf('day'), 'days');

            if (offsetDays === 0) {
                delete requestParams.offset;      
            } else {
                requestParams.offset = String(offsetDays); 
            }
        } else if (requestParams.offset == null || requestParams.offset === '') {
            delete requestParams.offset;          
        } else {
            requestParams.offset = String(requestParams.offset); 
            if (requestParams.offset === '0') delete requestParams.offset; 
        }
    } else if (requestParams.hasOwnProperty('offset')) {
        requestParams.offset = String(requestParams.offset);
    }

    //make sure the date time is utc
    if (requestParams.withAutoTime){ 
        const localDate = new Date(requestParams.fromDate * 1000); // this is wrongly interpreted as local time
        const utcTimestamp = Math.floor(localDate.getTime() / 1000) - (localDate.getTimezoneOffset() * 60);
        requestParams.fromDate = utcTimestamp;

        const localDateTo = new Date(requestParams.toDate * 1000); // this is wrongly interpreted as local time
        const utcTimestampTo = Math.floor(localDateTo.getTime() / 1000) - (localDateTo.getTimezoneOffset() * 60);
        requestParams.toDate = utcTimestampTo;
    }


    try {
        const response = await service.getReport(requestParams);
        this.setState({ htmlCode: response || '', isLoading: false });
    } catch (error) {
        console.error('Error fetching data:', error);
        this.setState({ isLoading: false, error: 'Error fetching report' });
    }
};

  
    fetchDateRangeReport = () => {
        const { from, to } = this.state;
        if (from && to) {
            this.fetchService({ scope: 'Retailer', from, to });
        }
    };

    onCalendarChange = (date, calendar) => {
           const localTimestamp = date.getTime() / 1000;
           this.fetchService({ [calendar]: localTimestamp });
           this.setState({
                  calendarOpen: false
           });
    }

    getFilters = () => {
           const { params } = this.state;
           const { i18n } = this.props;
           const filters = [];
           RetailerPortalStore.REPORTS[this.props.report].required.forEach((requiredField) => {
                  switch (requiredField) {
                         case 'type':
                                filters.push(<div className='type'>
                                       {    
                                       RetailerPortalStore.REPORTS[this.props.report].options["type"].length > 1 &&
                                              RetailerPortalStore.REPORTS[this.props.report].options["type"].map(type => (
                                                     <Button
                                                            key={type}
                                                            variant={'outline-primary'}
                                                            className={${params.type === type ? 'active' : ''}}
                                                            onClick={() => this.fetchService({ type, scope: 'Retailer' })}
                                                     >
                                                            {i18n.get(${type.toLowerCase()}_filter)}
                                                     </Button>
                                              ))
                                       }
                                </div>);
                                break;
                         case 'scope':
                                break;
                         case 'offset':
                         case 'fromDate':
                         case 'toDate':
                          const timestamp = this.state.params[requiredField];
                          const preSelected = moment.unix(timestamp).isValid()
                              ? moment.unix(timestamp).utc().toDate()
                              : new Date();
                                filters.push(<div key={date-picker-${requiredField}} className={requiredField}>
                                       {requiredField !== 'offset' && <span>{this.props.i18n.get(${requiredField}_label)}</span>}
                                       <DatePicker
                                              selected={preSelected}
                                              placeholderText={'select date'}
                                              minDate={moment().add(-6, 'months').utc().unix() * 1000}
                                              maxDate={moment().utc().unix() * 1000}
                                              onChange={(date) => this.onCalendarChange(date, requiredField)}
                                              showTimeSelect = { this.state.params.withTime ?? false }
                                              dateFormat={this.state.params.withTime || this.state.params.withAutoTime ? dateFormats.DateTimeOnly24Unicode : dateFormats.shortDateUnicode}
                                              timeFormat={dateFormats.timeOnly}
                                       />
                                </div>);
                                break;
                  }
           })
           return filters;
    };

    renderDayWeekActions = () => {
        const { i18n } = this.props;
        const filters = this.getFilters();
        return (
            <div className="action-container">
                <div className="filters">
                       { filters }
                </div>
                <Button
                    className={btn print ${!this.state.htmlCode ? 'disabled' : ''}}
                    onClick={this.printReport}
                >
                    {i18n.get('cash_reconciliation_print')}
                </Button>

            </div>
        );
    };

    renderDateRangeActions = () => {
        const { from, to, htmlCode } = this.state;
        const { i18n } = this.props;
        return (
            <div className="date-range-selection">
               {/* Html for date range selection goes here, to be implemented */}
            </div>
        );
    };

    renderActions = () => {
        const actionType = getReportActionType(RetailerPortalStore.REPORTS[this.props.report].slug);
        return actionType === 'buttons'
            ? this.renderDayWeekActions()
            : this.renderDateRangeActions();
    };

    printReport = () => {
        const { htmlCode } = this.state;
        const receipt = document.getElementById('receipt');
        receipt.style.width = '640px';
        receipt.style.background = '#fff';
        receipt.style.fontFamily = 'DejavuSans-Book';
        receipt.innerHTML = htmlCode;
       
        htmlToImage
            .toPng(document.getElementById('receipt'))
            .then(dataUrl => {
                const base64Encoded = dataUrl.split('base64,')[1];
                app.print(base64Encoded, false);
            })
            .catch(error => {
                console.error('Error creating report image:', error);
            }).finally(() => {
                receipt.innerHTML = '';
            });
    };

    render() {
        const { isLoading, htmlCode, error } = this.state;
        const { slug, i18n } = this.props;

        return (
            <div className="financial_sales">
                <div className="title">{i18n.get(RetailerPortalStore.REPORTS[this.props.report].name)}</div>
                <Row>
                    {this.renderActions()}
                    <Col lg={12} className="financial_sales__report">
                        {isLoading && <div className="d-flex justify-content-center">Loading...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {!isLoading && !htmlCode && <div className="d-flex justify-content-center">No data available</div>}
                        {!isLoading && htmlCode && (
                            <div>
                                <div ref={this.containerRef}>
                                    <RenderReport>
                                        <div id="report" style={{ width: '680px', background: '#fff', fontFamily: 'DejavuSans-Book' }} dangerouslySetInnerHTML={{ __html: htmlCode }} />
                                    </RenderReport>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GenericReport;
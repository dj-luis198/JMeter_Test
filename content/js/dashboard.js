/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 64.56692913385827, "KoPercent": 35.43307086614173};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4799081515499426, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a22eff06-58cb-470d-8bf8-498c6fbc6a3d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00c9b35f-0ad3-4324-863a-4261e11095cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1c23657-e941-4cc0-963b-b89dd0647724"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a002ebc5-5c4b-42fd-af1f-52218cf82f59"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2cc1fcd9-b12c-4676-a238-b784e9574a4f"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00c9b35f-0ad3-4324-863a-4261e11095cf"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1c23657-e941-4cc0-963b-b89dd0647724"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cc1fcd9-b12c-4676-a238-b784e9574a4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9aa086a9-f997-4953-a3f8-d527977ca733"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=880b08b1-10d8-4556-9bf1-c667e8d9502d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c495f6b-e55c-467b-b0ff-a3385649b39e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aa086a9-f997-4953-a3f8-d527977ca733"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14f71817-a523-4ffc-b314-9a6ba4cac8b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/880b08b1-10d8-4556-9bf1-c667e8d9502d"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8898305084745762, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14f71817-a523-4ffc-b314-9a6ba4cac8b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c807639-c395-44b7-bc6e-f2bd3353a0c5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e42df65-33c8-4778-b474-fa74ebb933ff"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c495f6b-e55c-467b-b0ff-a3385649b39e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f500ae26-7087-4245-a2cf-43bfac5d8a7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a57876b8-b8de-4720-91fb-563badf9476b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfb92c58-e6bc-4630-86f5-00d5afd61e7d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfb92c58-e6bc-4630-86f5-00d5afd61e7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a57876b8-b8de-4720-91fb-563badf9476b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c807639-c395-44b7-bc6e-f2bd3353a0c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c7e049f-59d0-4a20-899d-bac4f5421559"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c7e049f-59d0-4a20-899d-bac4f5421559"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a002ebc5-5c4b-42fd-af1f-52218cf82f59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e42df65-33c8-4778-b474-fa74ebb933ff"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 635, 225, 35.43307086614173, 316.91968503937034, 143, 2084, 154.0, 719.3999999999993, 1087.1999999999996, 1518.5599999999993, 2.489415085463384, 2.5570638990708794, 1.1972232057099732], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/a22eff06-58cb-470d-8bf8-498c6fbc6a3d", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.3637083570615034, 0.6795896212984055], "isController": false}, {"data": ["see books", 57, 57, 100.0, 822.1228070175437, 580, 1285, 885.0, 1038.8, 1075.8999999999999, 1285.0, 0.25971422322665305, 1.6728046815197382, 0.435985107154899], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 14, 100.0, 169.5, 145, 454, 147.5, 303.0, 454.0, 454.0, 0.08332986125578101, 0.04142080017499271, 0.0418276842631557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 183.5, 149, 436, 153.0, 409.30000000000007, 436.0, 436.0, 0.13090718680455557, 0.10163204444298991, 0.046533414059431864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 187.73333333333335, 145, 438, 150.0, 436.8, 438.0, 438.0, 0.11026006674409373, 0.05480700583275753, 0.055345385064906424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00c9b35f-0ad3-4324-863a-4261e11095cf", 3, 0, 0.0, 317.3333333333333, 222, 466, 264.0, 466.0, 466.0, 466.0, 0.01800190820226944, 0.024817083735876003, 0.011544192434398045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1c23657-e941-4cc0-963b-b89dd0647724", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a002ebc5-5c4b-42fd-af1f-52218cf82f59", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 151.75, 145, 158, 152.0, 158.0, 158.0, 158.0, 0.05204741519524286, 0.015349921278284518, 0.032173841619715565], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 260.52631578947364, 143, 813, 149.0, 587.2, 600.8, 813.0, 0.25575677082398546, 0.12712909799746935, 0.12363242339636019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cc1fcd9-b12c-4676-a238-b784e9574a4f", 3, 0, 0.0, 386.0, 221, 707, 230.0, 707.0, 707.0, 707.0, 0.10094891984655764, 0.04567675735244633, 0.06473612372972609], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 489.52941176470586, 149, 1143, 445.0, 927.7999999999998, 1143.0, 1143.0, 0.09935361705609388, 0.020620669716433088, 0.0664107702243054], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 489.52941176470586, 149, 1143, 445.0, 927.7999999999998, 1143.0, 1143.0, 0.1020892259835096, 0.021188440572059982, 0.06823932867326044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, 37.03703703703704, 943.7037037037038, 156, 1929, 1086.0, 1451.0, 1745.799999999999, 1929.0, 0.1065731980248434, 0.03316535719783538, 0.04808282957761489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00c9b35f-0ad3-4324-863a-4261e11095cf", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 469.2352941176471, 143, 1092, 451.0, 827.9999999999998, 1092.0, 1092.0, 0.09957067467917743, 0.025401732895808073, 0.06578368161105351], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 150.0, 145, 154, 150.0, 154.0, 154.0, 154.0, 0.059070234508831004, 0.046494735365349406, 0.02099762242306102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1211.5416666666665, 791, 2084, 1157.0, 1605.5, 1965.0, 2084.0, 0.10231356549986571, 0.052955263393485184, 0.04706024350628589], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 296.11764705882354, 143, 1254, 237.0, 635.5999999999995, 1254.0, 1254.0, 0.09898050084133425, 0.1741369955633446, 0.06201064695402064], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 148.6, 146, 150, 149.0, 150.0, 150.0, 150.0, 0.056414306668171044, 0.028041877045018617, 0.0283173375267968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1c23657-e941-4cc0-963b-b89dd0647724", 3, 0, 0.0, 832.3333333333334, 251, 1484, 762.0, 1484.0, 1484.0, 1484.0, 0.04559478395671535, 0.03801049534933204, 0.02923884257640926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cc1fcd9-b12c-4676-a238-b784e9574a4f", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aa086a9-f997-4953-a3f8-d527977ca733", 3, 0, 0.0, 302.3333333333333, 220, 429, 258.0, 429.0, 429.0, 429.0, 0.04991099206415227, 0.03267285320345384, 0.03200672342655598], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 837.25, 585, 1676, 781.0, 1076.5, 1191.7499999999998, 1676.0, 0.2920518099910924, 0.9685909686628408, 0.5692300829792205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=880b08b1-10d8-4556-9bf1-c667e8d9502d", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c495f6b-e55c-467b-b0ff-a3385649b39e", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aa086a9-f997-4953-a3f8-d527977ca733", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14f71817-a523-4ffc-b314-9a6ba4cac8b5", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 231.06666666666666, 146, 467, 153.0, 455.6, 467.0, 467.0, 0.11182513530841372, 0.08354123878021143, 0.03975034106666269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/880b08b1-10d8-4556-9bf1-c667e8d9502d", 3, 0, 0.0, 800.0, 241, 1743, 416.0, 1743.0, 1743.0, 1743.0, 0.025521271980195492, 0.02559604133169997, 0.016366180273758177], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 387.4117647058824, 145, 940, 414.0, 753.5999999999998, 940.0, 940.0, 0.10228147862918752, 0.021228342272935116, 0.0688026260769638], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 16, 9.03954802259887, 215.97740112994356, 145, 935, 154.0, 430.4000000000001, 465.2, 781.3399999999998, 0.7221011920789171, 1.578397158460415, 0.3457876984248403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 183.0, 147, 473, 150.0, 441.9000000000001, 473.0, 473.0, 0.05493418884176756, 0.04254180835109539, 0.019527387439847062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 19, 100.0, 178.47368421052633, 144, 429, 150.0, 428.0, 429.0, 429.0, 0.08758262729443435, 0.043534723918815514, 0.04396237346615162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14f71817-a523-4ffc-b314-9a6ba4cac8b5", 3, 0, 0.0, 365.3333333333333, 216, 558, 322.0, 558.0, 558.0, 558.0, 0.08159268929503917, 0.0378747314240644, 0.05232343682006092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 187.75, 147, 448, 151.0, 440.0, 446.75, 448.0, 0.13408795052154626, 0.10881551453457514, 0.0476640761619559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c807639-c395-44b7-bc6e-f2bd3353a0c5", 3, 0, 0.0, 329.0, 271, 433, 283.0, 433.0, 433.0, 433.0, 0.02104775736145314, 0.024877736646951937, 0.013497422526713113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e42df65-33c8-4778-b474-fa74ebb933ff", 3, 0, 0.0, 583.0, 269, 867, 613.0, 867.0, 867.0, 867.0, 0.04664686766283644, 0.03029313183182249, 0.029913518650972585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 494.2916666666668, 154, 1049, 474.0, 934.0, 1021.0, 1049.0, 0.1032675576362056, 0.06343290405583332, 0.04669226482965156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c495f6b-e55c-467b-b0ff-a3385649b39e", 3, 0, 0.0, 423.3333333333333, 238, 551, 481.0, 551.0, 551.0, 551.0, 0.0967305088024763, 0.0437680362094538, 0.06203095779325466], "isController": false}, {"data": ["login", 24, 9, 37.5, 2114.5416666666665, 1511, 3186, 2009.5, 3029.5, 3174.25, 3186.0, 0.1009298159292482, 0.1531935218828457, 0.1509511846637145], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 262.6, 146, 449, 150.5, 447.6, 449.0, 449.0, 0.057755394353832645, 0.02870849192002033, 0.028990500681513653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 238.85714285714286, 147, 467, 156.0, 460.5, 467.0, 467.0, 0.08093561571769659, 0.06552307170895552, 0.028770082149649955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 10, 100.0, 148.89999999999998, 144, 157, 148.0, 156.6, 157.0, 157.0, 0.1162682541158962, 0.05779349740721794, 0.05836121349176821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f500ae26-7087-4245-a2cf-43bfac5d8a7b", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a57876b8-b8de-4720-91fb-563badf9476b", 3, 0, 0.0, 328.6666666666667, 237, 440, 309.0, 440.0, 440.0, 440.0, 0.05116398055768739, 0.03289350963588301, 0.03281023492794406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfb92c58-e6bc-4630-86f5-00d5afd61e7d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfb92c58-e6bc-4630-86f5-00d5afd61e7d", 3, 0, 0.0, 598.0, 229, 1092, 473.0, 1092.0, 1092.0, 1092.0, 0.016068128866393507, 0.022151212808976726, 0.010304106076430732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 198.78947368421055, 145, 466, 151.0, 445.0, 466.0, 466.0, 0.09063199118484634, 0.07514312550384232, 0.03221684061648834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 178.0, 145, 447, 149.0, 403.50000000000057, 446.2, 447.0, 0.09517192808809113, 0.04730714003597499, 0.04777184671609262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a57876b8-b8de-4720-91fb-563badf9476b", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c807639-c395-44b7-bc6e-f2bd3353a0c5", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 0.19219581117021278, 0.7334607712765958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 154.95, 144, 186, 151.5, 170.60000000000002, 185.25, 186.0, 0.09498074265442683, 0.07373993204127864, 0.03376268586544078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c7e049f-59d0-4a20-899d-bac4f5421559", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c7e049f-59d0-4a20-899d-bac4f5421559", 3, 0, 0.0, 428.3333333333333, 293, 514, 478.0, 514.0, 514.0, 514.0, 0.026711779894933667, 0.026790037062594602, 0.01712962447689431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 24, 100.0, 183.875, 144, 443, 148.0, 433.0, 440.5, 443.0, 0.12829216402153168, 0.06377022606148401, 0.0643966526436204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 17, 100.0, 148.05882352941177, 143, 168, 147.0, 159.2, 168.0, 168.0, 0.09385731479743382, 0.04665368479677131, 0.05345790879001358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a002ebc5-5c4b-42fd-af1f-52218cf82f59", 3, 0, 0.0, 664.6666666666666, 289, 1254, 451.0, 1254.0, 1254.0, 1254.0, 0.019103656439842586, 0.026335932624587676, 0.012250717183102179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e42df65-33c8-4778-b474-fa74ebb933ff", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["register", 27, 10, 37.03703703703704, 943.7037037037038, 156, 1929, 1086.0, 1451.0, 1745.799999999999, 1929.0, 0.10590727229936456, 0.03295812249941163, 0.047782382619439866], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 4.444444444444445, 1.5748031496062993], "isController": false}, {"data": ["401/Unauthorized", 24, 10.666666666666666, 3.779527559055118], "isController": false}, {"data": ["404/Not Found", 191, 84.88888888888889, 30.078740157480315], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 635, 225, "404/Not Found", 191, "401/Unauthorized", 24, "406/Not Acceptable", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 24, "404/Not Found", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

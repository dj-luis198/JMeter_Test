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

    var data = {"OkPercent": 97.82608695652173, "KoPercent": 2.1739130434782608};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.715046604527297, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac728b5a-f76d-4d68-b67f-33c80bbaf1e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caf78334-3e25-455e-add7-e1285019965b"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec23dabb-1aa3-4f95-9aa0-5a051bb40550"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e78cc567-1803-4d73-a2f6-4e3f95012880"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/97cdd5ff-b21b-4301-9f22-1c2161c700ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/caa464bc-80f4-43f4-8da4-376f7213e86f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/08895181-ebb4-4902-8939-774b6bc6eb93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b375b3e-d83e-4715-b579-4208725cc786"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/487e5c5a-5482-486f-b14d-185aee5c91aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b60e0e7-dec1-4487-9f28-355d574c8f4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f9895eb-4bd9-4c89-8248-e30f26ecccd1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc97dac0-1623-4b0b-8ba8-c5d045f5e63b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90709f57-01b6-432c-b328-37416456737d"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/314681cf-eab2-48f5-8983-ca037dae1d33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=882ea40b-3b12-4de8-ac84-83950ccb5b32"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7b34a11-d9b2-41f7-bf11-df8baee3b0aa"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/caf78334-3e25-455e-add7-e1285019965b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac728b5a-f76d-4d68-b67f-33c80bbaf1e2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e78cc567-1803-4d73-a2f6-4e3f95012880"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec23dabb-1aa3-4f95-9aa0-5a051bb40550"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9088235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b375b3e-d83e-4715-b579-4208725cc786"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b60e0e7-dec1-4487-9f28-355d574c8f4a"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97cdd5ff-b21b-4301-9f22-1c2161c700ea"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f9895eb-4bd9-4c89-8248-e30f26ecccd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7b34a11-d9b2-41f7-bf11-df8baee3b0aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90709f57-01b6-432c-b328-37416456737d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc97dac0-1623-4b0b-8ba8-c5d045f5e63b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/882ea40b-3b12-4de8-ac84-83950ccb5b32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 28, 2.1739130434782608, 481.20807453416154, 135, 3887, 153.0, 1365.2000000000003, 1638.55, 2243.009999999991, 4.999786499800086, 699.8199964347893, 3.65426896682401], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2285.5370370370374, 1656, 3093, 2233.0, 2832.5, 3047.25, 3093.0, 0.23445844441163957, 282.1323907325958, 1.1528303394654347], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac728b5a-f76d-4d68-b67f-33c80bbaf1e2", 3, 0, 0.0, 538.0, 286, 745, 583.0, 745.0, 745.0, 745.0, 0.02100634391586259, 0.021067885939053597, 0.013470865076253028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caf78334-3e25-455e-add7-e1285019965b", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 716.3571428571428, 151, 2324, 576.5, 1702.0, 2324.0, 2324.0, 0.07482349671578295, 0.014739226752606797, 0.050345106676928174], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 716.3571428571428, 151, 2324, 576.5, 1702.0, 2324.0, 2324.0, 0.07451009611802399, 0.014677491032177716, 0.05013423459503762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 207.75000000000003, 138, 415, 139.5, 413.6, 415.0, 415.0, 0.11397472610448633, 0.030497143508427006, 0.06500121098146486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 175.0, 139, 415, 140.0, 413.6, 415.0, 415.0, 0.11397391422038282, 0.0847013171110462, 0.057209562411403084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 207.62499999999994, 136, 420, 139.0, 417.9, 420.0, 420.0, 0.11397553800015672, 0.030719969226604738, 0.06711645450595166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 207.25, 137, 415, 139.5, 412.9, 415.0, 415.0, 0.11397634990739422, 0.030720188060977347, 0.06700562758227668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec23dabb-1aa3-4f95-9aa0-5a051bb40550", 3, 0, 0.0, 433.6666666666667, 368, 521, 412.0, 521.0, 521.0, 521.0, 0.03733618747744272, 0.031125643271396747, 0.023942802516459038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e78cc567-1803-4d73-a2f6-4e3f95012880", 3, 0, 0.0, 450.6666666666667, 381, 536, 435.0, 536.0, 536.0, 536.0, 0.025330991623885434, 0.02540520351340854, 0.01624415804005674], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 333.92857142857144, 137, 745, 287.5, 650.5, 745.0, 745.0, 0.07419065939598204, 0.1457213021255624, 0.04795275181104699], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 155.94444444444443, 138, 423, 140.0, 174.6000000000004, 423.0, 423.0, 0.09895547003848268, 0.07354014912039582, 0.04967100742166025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97cdd5ff-b21b-4301-9f22-1c2161c700ea", 3, 0, 0.0, 1036.6666666666667, 360, 2233, 517.0, 2233.0, 2233.0, 2233.0, 0.03748125937031484, 0.024096838299600198, 0.02403583364567716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 185.0555555555556, 135, 416, 139.5, 414.2, 416.0, 416.0, 0.0989549260311928, 0.026478173566940256, 0.05643523125216464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 916.8571428571429, 685, 1090, 953.0, 1090.0, 1090.0, 1090.0, 0.040494261384672346, 11.906657383116206, 0.023094383445945946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1379.7142857142858, 947, 1643, 1365.0, 1643.0, 1643.0, 1643.0, 0.040369554435460614, 36.32459604313487, 0.022983838120970254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 234.57142857142858, 138, 525, 142.0, 525.0, 525.0, 525.0, 0.04065512835404809, 0.07194052009524915, 0.0225111892351028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caa464bc-80f4-43f4-8da4-376f7213e86f", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.4575013431232092, 0.8548419591690545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 160.53846153846155, 137, 413, 140.0, 304.5999999999999, 413.0, 413.0, 0.05927736334287851, 0.04405280615618217, 0.029754457771718316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 182.5384615384615, 137, 424, 139.0, 422.4, 424.0, 424.0, 0.05927628219158094, 0.022709513159334647, 0.033423059955679575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 309.2307692307692, 137, 1514, 141.0, 1074.7999999999997, 1514.0, 1514.0, 0.0592760119099187, 4.117567735667745, 0.03445596305280581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 213.53846153846155, 136, 830, 139.0, 663.9999999999999, 830.0, 830.0, 0.05927682276229994, 1.3554675031918288, 0.03451432190734577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 141.0, 136, 149, 141.0, 149.0, 149.0, 149.0, 0.04065583672615971, 0.03021395678574955, 0.022829205192911945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08895181-ebb4-4902-8939-774b6bc6eb93", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.3717531286379511, 0.694621289289872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 186.16666666666666, 138, 422, 140.0, 415.7, 422.0, 422.0, 0.09895438202988423, 0.026671298281492235, 0.05817435349803741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1022.1176470588235, 138, 1910, 1369.0, 1696.3999999999999, 1910.0, 1910.0, 0.08863122112968311, 46.921912228371376, 0.047625025416306054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 169.0, 137, 412, 139.0, 411.1, 412.0, 412.0, 0.0989549260311928, 0.02667144490684493, 0.05827130898125903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 688.6470588235294, 138, 1133, 818.0, 1108.2, 1133.0, 1133.0, 0.08863075904424761, 15.339475358042199, 0.047711330595338025], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 740.2857142857143, 140, 1520, 659.5, 1472.5, 1520.0, 1520.0, 0.07538594913602317, 0.014850022346549207, 0.051207336264410826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b375b3e-d83e-4715-b579-4208725cc786", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 471.15384615384613, 276, 1655, 281.0, 1324.5999999999997, 1655.0, 1655.0, 0.05923765692283156, 5.5361933539905674, 0.13206099342689845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 802.3913043478261, 182, 1613, 867.0, 1221.6000000000004, 1551.999999999999, 1613.0, 0.1006890634165988, 0.06184904383695376, 0.045526402697153565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 173.0, 138, 416, 140.0, 412.8, 416.0, 416.0, 0.08865386921989811, 0.06588436960580317, 0.04450008669826916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 294.52941176470586, 136, 556, 412.0, 451.19999999999993, 556.0, 556.0, 0.08865849270131998, 0.10205301451913197, 0.046183088914037766], "isController": false}, {"data": ["login", 23, 0, 0.0, 3565.956521739131, 2223, 5335, 3578.0, 5088.8, 5287.999999999999, 5335.0, 0.09682661300507707, 35.38623376180863, 0.1949564714382541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/487e5c5a-5482-486f-b14d-185aee5c91aa", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b60e0e7-dec1-4487-9f28-355d574c8f4a", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 144.0555555555556, 139, 153, 142.5, 150.3, 153.0, 153.0, 0.09908456867936784, 0.08021592522968353, 0.035221467772744035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f9895eb-4bd9-4c89-8248-e30f26ecccd1", 3, 0, 0.0, 398.3333333333333, 337, 482, 376.0, 482.0, 482.0, 482.0, 0.022916507524253303, 0.027086536074402263, 0.014695807233977542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc97dac0-1623-4b0b-8ba8-c5d045f5e63b", 1, 0, 0.0, 1425.0, 1425, 1425, 1425.0, 1425.0, 1425.0, 1425.0, 0.7017543859649122, 0.12678179824561403, 0.4838267543859649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90709f57-01b6-432c-b328-37416456737d", 1, 0, 0.0, 1199.0, 1199, 1199, 1199.0, 1199.0, 1199.0, 1199.0, 0.8340283569641368, 0.1506789512093411, 0.5750234570475395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1228.1176470588234, 280, 2052, 1509.0, 1841.6, 2052.0, 2052.0, 0.08856150075277275, 62.38024763521258, 0.18584789659923837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1031.8181818181818, 137, 1782, 1367.0, 1776.6, 1782.0, 1782.0, 0.062170777473831755, 47.33741723515249, 0.1041901426112857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 452.625, 278, 832, 420.0, 829.9, 832.0, 832.0, 0.11386117476267062, 0.17646258237144363, 0.2560764506625297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314681cf-eab2-48f5-8983-ca037dae1d33", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.5661984707446809, 1.0579427083333335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=882ea40b-3b12-4de8-ac84-83950ccb5b32", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7b34a11-d9b2-41f7-bf11-df8baee3b0aa", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1195.826086956522, 277, 2085, 1223.0, 1969.2, 2067.2, 2085.0, 0.10040642775757523, 0.03147932500687566, 0.045300556273437265], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 388.7777777777778, 278, 846, 283.0, 584.1000000000004, 846.0, 846.0, 0.09887773767736194, 0.1532411813417709, 0.22237834948336382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 142.23076923076925, 139, 145, 142.0, 144.6, 145.0, 145.0, 0.08427111963906031, 0.06542533214165326, 0.02995574955919722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caf78334-3e25-455e-add7-e1285019965b", 3, 0, 0.0, 407.0, 250, 659, 312.0, 659.0, 659.0, 659.0, 0.01984363217843394, 0.027356048917860594, 0.012725245895675412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac728b5a-f76d-4d68-b67f-33c80bbaf1e2", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e78cc567-1803-4d73-a2f6-4e3f95012880", 1, 0, 0.0, 1520.0, 1520, 1520, 1520.0, 1520.0, 1520.0, 1520.0, 0.6578947368421052, 0.11885793585526315, 0.4535875822368421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 562.2777777777776, 278, 1634, 554.0, 1514.3000000000002, 1634.0, 1634.0, 0.08652972536426612, 11.621385280812996, 0.19214744244571463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec23dabb-1aa3-4f95-9aa0-5a051bb40550", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 140.54545454545453, 138, 143, 140.0, 142.8, 143.0, 143.0, 0.05155460570100203, 0.03831353021334233, 0.025877995439760784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 165.54545454545453, 138, 413, 140.0, 359.8000000000002, 413.0, 413.0, 0.05155557221998294, 0.020834602694012994, 0.02900916341710333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 263.8181818181818, 138, 1223, 139.0, 1062.4000000000005, 1223.0, 1223.0, 0.05155533058684027, 4.2298668012377965, 0.029906119500569452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 226.45454545454544, 137, 1088, 140.0, 899.6000000000007, 1088.0, 1088.0, 0.05155508895596258, 1.3907150017106915, 0.029956326102341536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 140.5, 140, 141, 140.5, 141.0, 141.0, 141.0, 0.020095251492072422, 0.005926529248638547, 0.012422162299298677], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1555.1666666666665, 1093, 2524, 1447.5, 2262.0, 2476.25, 2524.0, 0.23776605581338006, 284.45086360814395, 0.4694950828658735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1195.826086956522, 277, 2085, 1223.0, 1969.2, 2067.2, 2085.0, 0.09828219810272626, 0.030813338603538156, 0.04434216359712845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 139.0, 138, 141, 138.5, 141.0, 141.0, 141.0, 0.035445700141192034, 0.009553723866180667, 0.02087280975111211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 183.5, 137, 409, 138.5, 409.0, 409.0, 409.0, 0.03544611894535981, 0.009553836746991512, 0.02083844102061192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 201.99999999999997, 137, 414, 140.0, 413.2, 414.0, 414.0, 0.08388774529099367, 0.022610368847963143, 0.049316819008963085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 201.69230769230768, 137, 414, 139.0, 412.8, 414.0, 414.0, 0.08388666266591814, 0.022610077046673248, 0.049398103112840465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 139.0, 137, 141, 139.0, 141.0, 141.0, 141.0, 0.03544590954203885, 0.009484550014178365, 0.02021524528569403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 140.9230769230769, 138, 150, 140.0, 147.6, 150.0, 150.0, 0.08388666266591814, 0.0623415530163708, 0.04210717247097844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 140.33333333333334, 138, 144, 140.0, 144.0, 144.0, 144.0, 0.035444443788065855, 0.02634103683859191, 0.017791449323306494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 160.23076923076923, 137, 414, 139.0, 305.5999999999999, 414.0, 414.0, 0.0838872039749629, 0.022446380751113118, 0.047841921016971024], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 583.1428571428571, 138, 1095, 528.5, 1053.5, 1095.0, 1095.0, 0.07471767393207096, 0.014426515167687807, 0.05084721169651815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 146.16666666666666, 140, 167, 142.5, 167.0, 167.0, 167.0, 0.036196474463387265, 0.02849058439208021, 0.012866715531907193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1935.391304347826, 1238, 3887, 1768.0, 2776.2000000000003, 3669.399999999997, 3887.0, 0.09984198919970134, 0.05167602956625167, 0.045923414954159504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 325.5, 277, 550, 281.0, 550.0, 550.0, 550.0, 0.03541536318454946, 0.05488689587292968, 0.07964998184962636], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 1325.9310344827588, 702, 3577, 1096.0, 2373.0, 2608.7999999999997, 3577.0, 0.27151778441487917, 79.46437557931596, 0.987520678361437], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 232.18518518518516, 138, 758, 141.0, 558.0, 560.5, 758.0, 0.23919947907669, 0.1777644566185167, 0.1156286544364859], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 907.3518518518522, 677, 1374, 828.0, 1225.0, 1276.25, 1374.0, 0.2389010551463269, 70.24484247461676, 0.12015043300816246], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 206.35185185185185, 138, 557, 144.5, 416.0, 418.25, 557.0, 0.23968574535608866, 0.4241314165871413, 0.11656591912825408], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1320.1851851851854, 955, 1922, 1239.5, 1704.5, 1814.75, 1922.0, 0.23839375584947642, 214.50712056488285, 0.11966249072913172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 178.50000000000003, 139, 418, 146.0, 417.1, 418.0, 418.0, 0.08836264027569143, 0.0660131052840859, 0.031410157285499694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, 7.647058823529412, 205.65294117647062, 139, 1662, 147.5, 348.30000000000007, 421.0, 903.0099999999915, 0.7040153723827193, 1.5034254747962497, 0.33840702156978864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 277.8181818181818, 141, 525, 147.0, 504.6000000000001, 525.0, 525.0, 0.05073098740949131, 0.03928679005442051, 0.018033280680717613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b375b3e-d83e-4715-b579-4208725cc786", 3, 0, 0.0, 395.0, 227, 500, 458.0, 500.0, 500.0, 500.0, 0.06302521008403361, 0.04051913734243697, 0.04041655724789916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 144.31249999999997, 139, 156, 143.0, 152.5, 156.0, 156.0, 0.11410640422193695, 0.0926000213949508, 0.040561260875766655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b60e0e7-dec1-4487-9f28-355d574c8f4a", 3, 0, 0.0, 508.66666666666663, 224, 1012, 290.0, 1012.0, 1012.0, 1012.0, 0.018589779339319244, 0.02562751155664616, 0.011921180110175426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 406.45454545454544, 277, 1363, 283.0, 1202.8000000000006, 1363.0, 1363.0, 0.05152104166178778, 5.675959359851057, 0.11467365372005339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97cdd5ff-b21b-4301-9f22-1c2161c700ea", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 386.15384615384613, 277, 564, 282.0, 560.4, 564.0, 564.0, 0.08381148862097865, 0.12989143793114563, 0.18849400224034554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f9895eb-4bd9-4c89-8248-e30f26ecccd1", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 166.69230769230765, 140, 414, 143.0, 318.3999999999999, 414.0, 414.0, 0.060671115881831335, 0.050302516976244924, 0.021566685723619732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7b34a11-d9b2-41f7-bf11-df8baee3b0aa", 3, 0, 0.0, 469.33333333333337, 240, 896, 272.0, 896.0, 896.0, 896.0, 0.05046087600080738, 0.03139021290284599, 0.03235935082083025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 147.7058823529412, 139, 174, 144.0, 166.0, 174.0, 174.0, 0.08367171157868833, 0.06495997139165743, 0.02974267872523686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90709f57-01b6-432c-b328-37416456737d", 3, 0, 0.0, 442.0, 266, 572, 488.0, 572.0, 572.0, 572.0, 0.018613308515588647, 0.02565994842562432, 0.011936268807197146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc97dac0-1623-4b0b-8ba8-c5d045f5e63b", 3, 0, 0.0, 434.3333333333333, 234, 556, 513.0, 556.0, 556.0, 556.0, 0.09253547193090685, 0.041869891270820477, 0.05934078115360888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 156.1111111111111, 138, 415, 141.0, 172.90000000000038, 415.0, 415.0, 0.08670144357903559, 0.06443339703481063, 0.043520060546508095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/882ea40b-3b12-4de8-ac84-83950ccb5b32", 3, 0, 0.0, 539.0, 237, 1095, 285.0, 1095.0, 1095.0, 1095.0, 0.07706733115832198, 0.036225659567909164, 0.04942143306702289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 246.2777777777778, 137, 416, 142.5, 415.1, 416.0, 416.0, 0.08658799986530755, 0.03761917876092572, 0.048574214334162334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 358.66666666666663, 137, 1493, 142.0, 1374.2000000000003, 1493.0, 1493.0, 0.08670269645385971, 8.689132373943913, 0.050143812076722256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 290.77777777777777, 137, 1088, 140.5, 845.9000000000004, 1088.0, 1088.0, 0.0865892494636277, 2.8496469383484544, 0.050162760729851166], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5434782608695652], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.15527950310559005], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15527950310559005], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.3198757763975155], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

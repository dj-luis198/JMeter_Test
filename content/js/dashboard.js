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

    var data = {"OkPercent": 67.56756756756756, "KoPercent": 32.432432432432435};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5127758420441347, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6628ba4-0592-47d7-94fe-f8234fc1dc3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2ba2d90-3997-405a-a288-280241566f7c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f429ac43-2b85-43a3-8615-5ae50d644922"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c6008aa-6f47-4972-8ab3-62712d4b34fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2ba2d90-3997-405a-a288-280241566f7c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f0d3cab-9a39-4584-8b0d-da18f1392949"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4bf70726-94f4-41de-9185-a681db8bc197"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bf70726-94f4-41de-9185-a681db8bc197"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f0d3cab-9a39-4584-8b0d-da18f1392949"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6628ba4-0592-47d7-94fe-f8234fc1dc3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62d75f72-d7ec-405f-b912-3e2f2a51f072"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9517045454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95269508-a06c-4d8b-880b-aea28eff9267"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3988fe06-3aa2-46c6-b9f3-1b14fc69b96d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0608591e-5ae5-4066-8585-390a0519c46c"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01b6a779-7e05-4a23-ba88-f7dbd13c241f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01b6a779-7e05-4a23-ba88-f7dbd13c241f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0608591e-5ae5-4066-8585-390a0519c46c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3abc9e51-e92e-436a-82a1-ba4788bd4d7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3abc9e51-e92e-436a-82a1-ba4788bd4d7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95269508-a06c-4d8b-880b-aea28eff9267"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28d7e686-c9c3-487b-b2aa-dfd8e26ca1bb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0668f3cf-8738-4a98-be73-e00870892656"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3988fe06-3aa2-46c6-b9f3-1b14fc69b96d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cc44b79-f6a6-49be-9676-0d86b20fd6f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f429ac43-2b85-43a3-8615-5ae50d644922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c6008aa-6f47-4972-8ab3-62712d4b34fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f770082-6147-4b4d-8965-f3c7f9d8a20f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28d7e686-c9c3-487b-b2aa-dfd8e26ca1bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0668f3cf-8738-4a98-be73-e00870892656"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9955e137-f8d3-46db-b06e-62bfc09511d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0cc44b79-f6a6-49be-9676-0d86b20fd6f1"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 629, 204, 32.432432432432435, 270.3449920508743, 107, 2356, 120.0, 594.0, 906.0, 1506.6000000000004, 2.477841244829624, 2.5560624199822732, 1.1932951299980303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 644.7241379310348, 439, 1079, 681.0, 820.3, 884.1499999999999, 1079.0, 0.2591379641585388, 1.667441451016223, 0.4350177347544221], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, 100.0, 116.11111111111111, 111, 126, 115.0, 122.4, 126.0, 126.0, 0.09080636048107192, 0.04513714598131407, 0.04558053641335055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 145.20000000000002, 112, 346, 115.0, 337.6, 346.0, 346.0, 0.0863667246283352, 0.06705229109328759, 0.030700671645228526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6628ba4-0592-47d7-94fe-f8234fc1dc3c", 3, 0, 0.0, 263.0, 190, 406, 193.0, 406.0, 406.0, 406.0, 0.03225112878950763, 0.03255558280477317, 0.02068187620941733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2ba2d90-3997-405a-a288-280241566f7c", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, 100.0, 143.80952380952382, 110, 510, 114.0, 294.40000000000015, 492.7999999999997, 510.0, 0.10453429969485939, 0.05196089701629242, 0.05247131840152122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f429ac43-2b85-43a3-8615-5ae50d644922", 3, 0, 0.0, 473.6666666666667, 198, 848, 375.0, 848.0, 848.0, 848.0, 0.03711217774258993, 0.030938895572517194, 0.02379915044039784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.0, 113, 118, 117.0, 118.0, 118.0, 118.0, 0.11112757445547489, 0.03277395262261076, 0.06869507288116758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c6008aa-6f47-4972-8ab3-62712d4b34fc", 3, 0, 0.0, 432.0, 189, 725, 382.0, 725.0, 725.0, 725.0, 0.01986899707925743, 0.027391016481333075, 0.012741511798872765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2ba2d90-3997-405a-a288-280241566f7c", 3, 0, 0.0, 305.3333333333333, 183, 524, 209.0, 524.0, 524.0, 524.0, 0.04017408771342484, 0.02629885754938065, 0.025762679946434552], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 214.55172413793107, 108, 726, 114.0, 450.3, 469.94999999999965, 726.0, 0.2497825169464518, 0.12415947375560935, 0.12074447840673207], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 415.1176470588235, 114, 798, 413.0, 649.9999999999999, 798.0, 798.0, 0.08711158481593835, 0.017494376178568503, 0.058473050814237114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 415.1176470588235, 114, 798, 413.0, 649.9999999999999, 798.0, 798.0, 0.08910320247392421, 0.017894347188007757, 0.059809910438178106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f0d3cab-9a39-4584-8b0d-da18f1392949", 3, 0, 0.0, 299.0, 202, 410, 285.0, 410.0, 410.0, 410.0, 0.033977393707386686, 0.028325555105669694, 0.02178888854282284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 877.1199999999998, 150, 1546, 853.0, 1405.6000000000001, 1508.1999999999998, 1546.0, 0.10546565194647407, 0.033155764330672785, 0.047583135936788104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bf70726-94f4-41de-9185-a681db8bc197", 3, 0, 0.0, 584.0, 185, 1055, 512.0, 1055.0, 1055.0, 1055.0, 0.022666999115987036, 0.022733406339959652, 0.014535803469561999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bf70726-94f4-41de-9185-a681db8bc197", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 171.875, 111, 359, 116.0, 359.0, 359.0, 359.0, 0.043746206383665165, 0.0344330491652677, 0.015550409300443479], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 405.87499999999994, 112, 920, 400.5, 702.3000000000002, 920.0, 920.0, 0.08839290646925585, 0.021213434340644165, 0.05875776027567538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f0d3cab-9a39-4584-8b0d-da18f1392949", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1120.9565217391303, 796, 2072, 1070.0, 1697.2000000000005, 2023.1999999999994, 2072.0, 0.0983986686232315, 0.050928998408508494, 0.045259543868693394], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 200.76470588235293, 112, 425, 196.0, 298.5999999999999, 425.0, 425.0, 0.08660213958227203, 0.17650757768721345, 0.05468849496943454], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 113.49999999999999, 107, 120, 114.0, 120.0, 120.0, 120.0, 0.04591948019148423, 0.022825210368618627, 0.02304942658049111], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 743.1186440677966, 458, 2703, 629.0, 906.0, 1858.0, 2703.0, 0.28571290211669675, 0.9105632736040019, 0.5592862216768926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6628ba4-0592-47d7-94fe-f8234fc1dc3c", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62d75f72-d7ec-405f-b912-3e2f2a51f072", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 158.19047619047623, 112, 338, 117.0, 332.8, 337.5, 338.0, 0.10627422799364379, 0.07939432071790771, 0.03777716698211556], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 472.9411764705883, 113, 891, 439.0, 847.8, 891.0, 891.0, 0.08902387934645999, 0.01787841694595727, 0.06025783377408881], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, 2.272727272727273, 206.5454545454545, 109, 2356, 122.5, 335.6, 436.6, 1821.6199999999928, 0.7260666166120742, 1.5756891251412943, 0.34860656961369957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 163.2, 111, 345, 120.0, 345.0, 345.0, 345.0, 0.05660078335484163, 0.04383244257850529, 0.02011980970816636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 133.41666666666666, 110, 334, 115.0, 271.0000000000002, 334.0, 334.0, 0.05932165685387593, 0.029487034510373874, 0.02977669103798069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 116.0909090909091, 107, 129, 116.0, 124.19999999999999, 128.54999999999998, 129.0, 0.10786746030967768, 0.08753697218490443, 0.03834351128195573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 368.1304347826087, 124, 892, 293.0, 750.8000000000001, 869.5999999999997, 892.0, 0.09845637526433397, 0.06047759769654889, 0.04451689623768225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95269508-a06c-4d8b-880b-aea28eff9267", 3, 0, 0.0, 276.6666666666667, 189, 420, 221.0, 420.0, 420.0, 420.0, 0.059550985568811166, 0.03828554573515691, 0.03818862030291601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3988fe06-3aa2-46c6-b9f3-1b14fc69b96d", 2, 0, 0.0, 258.5, 202, 315, 258.5, 315.0, 315.0, 315.0, 0.035989994781450756, 0.031016767963506147, 0.022370734060931062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0608591e-5ae5-4066-8585-390a0519c46c", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["login", 23, 6, 26.08695652173913, 1820.7391304347827, 1159, 2728, 1718.0, 2570.4, 2712.0, 2728.0, 0.09667724511884997, 0.14477778682667453, 0.14497892409785418], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/01b6a779-7e05-4a23-ba88-f7dbd13c241f", 3, 0, 0.0, 313.0, 249, 423, 267.0, 423.0, 423.0, 423.0, 0.021614300020893824, 0.02549811955589818, 0.013860732760794543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 113.0, 111, 116, 113.0, 116.0, 116.0, 116.0, 0.0568356200197788, 0.028251299404362704, 0.028528817080240527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 179.7777777777778, 112, 533, 117.5, 405.2000000000002, 533.0, 533.0, 0.09177913860179582, 0.07430166591883665, 0.0326246156748571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 129.26666666666668, 107, 334, 113.0, 212.80000000000007, 334.0, 334.0, 0.08380590552280917, 0.04165742764756823, 0.04206663617062882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01b6a779-7e05-4a23-ba88-f7dbd13c241f", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 0.2027655022446689, 0.7737969977553311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0608591e-5ae5-4066-8585-390a0519c46c", 3, 0, 0.0, 625.0, 425, 920, 530.0, 920.0, 920.0, 920.0, 0.07366120755272915, 0.03332977815699659, 0.04723716760380092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3abc9e51-e92e-436a-82a1-ba4788bd4d7e", 3, 0, 0.0, 329.0, 215, 395, 377.0, 395.0, 395.0, 395.0, 0.025583081055728478, 0.025658031488508933, 0.016405816953055045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3abc9e51-e92e-436a-82a1-ba4788bd4d7e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95269508-a06c-4d8b-880b-aea28eff9267", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28d7e686-c9c3-487b-b2aa-dfd8e26ca1bb", 3, 0, 0.0, 362.0, 196, 609, 281.0, 609.0, 609.0, 609.0, 0.01647211271317659, 0.022708137155046507, 0.010563171238593062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0668f3cf-8738-4a98-be73-e00870892656", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 137.16666666666666, 112, 339, 117.0, 278.10000000000025, 339.0, 339.0, 0.061041055196374164, 0.05060923423996256, 0.02169818758933613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3988fe06-3aa2-46c6-b9f3-1b14fc69b96d", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 129.37499999999997, 109, 335, 115.0, 193.60000000000014, 335.0, 335.0, 0.08185734311528584, 0.04068885512273485, 0.041088549180914966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cc44b79-f6a6-49be-9676-0d86b20fd6f1", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f429ac43-2b85-43a3-8615-5ae50d644922", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 136.6875, 114, 402, 117.5, 210.9000000000002, 402.0, 402.0, 0.0831022053247738, 0.06451782542304217, 0.02954023704904069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c6008aa-6f47-4972-8ab3-62712d4b34fc", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f770082-6147-4b4d-8965-f3c7f9d8a20f", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28d7e686-c9c3-487b-b2aa-dfd8e26ca1bb", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0668f3cf-8738-4a98-be73-e00870892656", 3, 0, 0.0, 255.66666666666666, 192, 382, 193.0, 382.0, 382.0, 382.0, 0.01865080105190518, 0.025711634913677877, 0.011960311872478256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 22, 100.0, 133.4090909090909, 107, 336, 114.0, 268.79999999999984, 335.55, 336.0, 0.1048467807272554, 0.05211622206071581, 0.052628169232235615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 12, 100.0, 151.0, 112, 344, 114.0, 340.1, 344.0, 344.0, 0.14934103269324106, 0.07423299378990206, 0.08513459749480418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9955e137-f8d3-46db-b06e-62bfc09511d5", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cc44b79-f6a6-49be-9676-0d86b20fd6f1", 3, 0, 0.0, 279.3333333333333, 206, 393, 239.0, 393.0, 393.0, 393.0, 0.03147194276302676, 0.03156414572034032, 0.0201822028786337], "isController": false}, {"data": ["register", 25, 7, 28.0, 877.1199999999998, 150, 1546, 853.0, 1405.6000000000001, 1508.1999999999998, 1546.0, 0.10008326928004099, 0.03146367777991289, 0.045154756257206], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.4313725490196076, 1.1128775834658187], "isController": false}, {"data": ["401/Unauthorized", 10, 4.901960784313726, 1.589825119236884], "isController": false}, {"data": ["404/Not Found", 187, 91.66666666666667, 29.72972972972973], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 629, 204, "404/Not Found", 187, "401/Unauthorized", 10, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

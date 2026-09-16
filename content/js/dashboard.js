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

    var data = {"OkPercent": 98.39181286549707, "KoPercent": 1.608187134502924};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7683846637335009, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7794532a-835f-4944-bf87-f19e64fb37ec"], "isController": false}, {"data": [0.01694915254237288, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deeb2f48-d583-45ad-a947-a3710e068588"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fefdbc07-7a17-4b76-9039-3a2f9e61d827"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3b67e63e-a46d-466e-9294-bf7516273516"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d91deb2-b5c5-470d-ba57-306360609ee0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/30e67130-37d8-4a22-ac7d-7f18cd1f6d70"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6bc1e80-0092-494d-a9aa-e59a1a87467f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/979bd436-f56b-49bb-95b5-9200fb031dc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=156df84c-fcab-4d95-b889-2f1dd26bc37e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=049469d1-472f-40a2-98b4-3d9b3c4fcb52"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03ebf8e6-8d98-40cd-aafa-1f8057b0a005"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3793b83-e612-4ed6-8f6d-bbf2b53c37b9"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19d17595-329f-4533-84c3-c00fcd04b22f"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30e67130-37d8-4a22-ac7d-7f18cd1f6d70"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d91deb2-b5c5-470d-ba57-306360609ee0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecbf0b91-2493-412e-b1b4-4f48e79a7b88"], "isController": false}, {"data": [0.27419354838709675, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0199021-9b5c-4e0c-8c4a-526d1bd4ed9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4661016949152542, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9344262295081968, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fefdbc07-7a17-4b76-9039-3a2f9e61d827"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/156df84c-fcab-4d95-b889-2f1dd26bc37e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=979bd436-f56b-49bb-95b5-9200fb031dc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6bc1e80-0092-494d-a9aa-e59a1a87467f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0199021-9b5c-4e0c-8c4a-526d1bd4ed9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecbf0b91-2493-412e-b1b4-4f48e79a7b88"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/03ebf8e6-8d98-40cd-aafa-1f8057b0a005"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19d17595-329f-4533-84c3-c00fcd04b22f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb0655bf-7680-4738-832b-a502b80d0d18"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7794532a-835f-4944-bf87-f19e64fb37ec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/049469d1-472f-40a2-98b4-3d9b3c4fcb52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3793b83-e612-4ed6-8f6d-bbf2b53c37b9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1368, 22, 1.608187134502924, 421.7309941520467, 115, 2801, 143.0, 1192.1000000000001, 1416.1, 1919.0299999999993, 5.401115756807656, 759.246785808055, 3.9494024176704925], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7794532a-835f-4944-bf87-f19e64fb37ec", 3, 0, 0.0, 326.3333333333333, 227, 497, 255.0, 497.0, 497.0, 497.0, 0.025903827722276427, 0.025979717842556534, 0.016611504105756694], "isController": false}, {"data": ["see books", 59, 0, 0.0, 2001.6440677966102, 1439, 3096, 1965.0, 2432.0, 2534.0, 3096.0, 0.2573037186928971, 309.62200662965927, 1.265160374627673], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/deeb2f48-d583-45ad-a947-a3710e068588", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 605.3571428571428, 126, 1150, 534.5, 1048.5, 1150.0, 1150.0, 0.08772864277523296, 0.016565390345462862, 0.05932820812680549], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 605.3571428571428, 126, 1150, 534.5, 1048.5, 1150.0, 1150.0, 0.08757553389798702, 0.016536479510452767, 0.05922466525816016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 163.11111111111111, 119, 363, 123.0, 362.1, 363.0, 363.0, 0.11466501888787672, 0.0498175711400888, 0.06432488581275202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 123.55555555555556, 121, 126, 124.0, 126.0, 126.0, 126.0, 0.11466355801020506, 0.08521383559156841, 0.057555731266841215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 264.5555555555555, 120, 1081, 124.0, 1000.9000000000001, 1081.0, 1081.0, 0.11466647980277365, 3.773666882728043, 0.06642842183886812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 273.33333333333337, 119, 1356, 123.5, 1125.6000000000004, 1356.0, 1356.0, 0.11466647980277365, 11.491594409531332, 0.06631644285468571], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 279.40000000000003, 128, 477, 240.0, 437.40000000000003, 477.0, 477.0, 0.07840759403684111, 0.15418628762257722, 0.05068417976509085], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fefdbc07-7a17-4b76-9039-3a2f9e61d827", 3, 0, 0.0, 1301.6666666666667, 211, 2725, 969.0, 2725.0, 2725.0, 2725.0, 0.02960331557134399, 0.024679066138740872, 0.018983897029800672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 142.91666666666666, 116, 369, 123.0, 296.40000000000026, 369.0, 369.0, 0.06174268735046693, 0.04588494636104037, 0.030991934861464846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 181.83333333333334, 115, 364, 123.5, 362.8, 364.0, 364.0, 0.06166780580807951, 0.024219468654768206, 0.034738326155885936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 807.8, 601, 1030, 835.0, 1030.0, 1030.0, 1030.0, 0.04968104767393335, 14.607877582172453, 0.028333722501540114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1103.2, 856, 1313, 1110.0, 1313.0, 1313.0, 1313.0, 0.04943740236113034, 44.483861546228916, 0.028146489820838852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 267.8, 125, 369, 357.0, 369.0, 369.0, 369.0, 0.04992311839766759, 0.08834051810212273, 0.02764297669089602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 140.66666666666666, 119, 376, 123.0, 227.2000000000001, 376.0, 376.0, 0.06719105552668829, 0.049933977788876746, 0.03372676029366971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b67e63e-a46d-466e-9294-bf7516273516", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 219.0, 120, 372, 127.0, 369.0, 372.0, 372.0, 0.06719135650389933, 0.024706821714454652, 0.037943868900704614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 232.73333333333335, 121, 1063, 124.0, 641.8000000000002, 1063.0, 1063.0, 0.06719135650389933, 4.047496205088177, 0.03911621808970494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 250.19999999999996, 121, 949, 124.0, 669.4000000000002, 949.0, 949.0, 0.0671901526112333, 1.3339782421488307, 0.0391811326132042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d91deb2-b5c5-470d-ba57-306360609ee0", 3, 0, 0.0, 484.0, 331, 644, 477.0, 644.0, 644.0, 644.0, 0.027428822206374458, 0.027509180083932196, 0.01758944653208258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 178.8, 119, 362, 133.0, 362.0, 362.0, 362.0, 0.04992610935814994, 0.03710329025542198, 0.02803468054778927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 758.6190476190476, 118, 1668, 361.0, 1490.2, 1650.5999999999997, 1668.0, 0.09891849116328146, 42.39826667424257, 0.05410524986339828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 264.0833333333333, 120, 1093, 123.0, 876.7000000000007, 1093.0, 1093.0, 0.06166685509316834, 4.639231433458894, 0.03581174136920974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 521.1904761904761, 120, 1077, 364.0, 1056.0, 1076.5, 1077.0, 0.09880772017653647, 13.84859304864163, 0.054141153591895884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 215.08333333333331, 120, 1000, 123.0, 806.2000000000007, 1000.0, 1000.0, 0.061743958096433765, 1.5281529134143894, 0.03591681416612212], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 590.2857142857143, 129, 1143, 541.5, 1069.5, 1143.0, 1143.0, 0.08748414349899081, 0.016519222687762843, 0.05987074022520918], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/30e67130-37d8-4a22-ac7d-7f18cd1f6d70", 3, 0, 0.0, 417.0, 220, 523, 508.0, 523.0, 523.0, 523.0, 0.04658385093167702, 0.029948927600931673, 0.029873107531055897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 433.0, 244, 1183, 258.0, 919.6000000000001, 1183.0, 1183.0, 0.06715135018981448, 5.4528907397168895, 0.14987954027066472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6bc1e80-0092-494d-a9aa-e59a1a87467f", 3, 0, 0.0, 373.66666666666663, 240, 633, 248.0, 633.0, 633.0, 633.0, 0.017847687832041357, 0.02460447850543462, 0.011445294605833814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 697.095238095238, 130, 1696, 677.0, 1625.4, 1694.6, 1696.0, 0.09000861511030342, 0.05528849502380942, 0.04069725468366258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 148.0952380952381, 119, 375, 123.0, 325.8000000000002, 374.6, 375.0, 0.09891849116328146, 0.0735126677492746, 0.04965244575969401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 204.90476190476193, 118, 373, 126.0, 370.2, 372.8, 373.0, 0.09891755927988016, 0.09721557374539562, 0.05245795414935609], "isController": false}, {"data": ["login", 21, 0, 0.0, 2957.2857142857147, 1844, 5095, 2570.0, 4811.6, 5081.4, 5095.0, 0.0893814801573114, 25.582751123386878, 0.17014652577378825], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/979bd436-f56b-49bb-95b5-9200fb031dc4", 3, 0, 0.0, 398.6666666666667, 287, 498, 411.0, 498.0, 498.0, 498.0, 0.06414368184733804, 0.029733269189651485, 0.04113380639298696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 135.91666666666669, 121, 247, 125.5, 213.10000000000014, 247.0, 247.0, 0.06191375414048231, 0.05012353728755843, 0.02200840479212457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=156df84c-fcab-4d95-b889-2f1dd26bc37e", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=049469d1-472f-40a2-98b4-3d9b3c4fcb52", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 920.8571428571428, 242, 1798, 747.0, 1615.8, 1780.0999999999997, 1798.0, 0.09875103453464751, 56.337580007441595, 0.2100617825854902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03ebf8e6-8d98-40cd-aafa-1f8057b0a005", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3793b83-e612-4ed6-8f6d-bbf2b53c37b9", 3, 0, 0.0, 343.3333333333333, 236, 467, 327.0, 467.0, 467.0, 467.0, 0.02343530294034934, 0.027699734692841295, 0.01502849830484642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 451.9444444444445, 244, 1480, 261.0, 1250.5000000000005, 1480.0, 1480.0, 0.11457378551787352, 15.387846187875546, 0.2544219314912414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 952.2857142857143, 125, 1676, 1185.0, 1676.0, 1676.0, 1676.0, 0.06913034031878963, 59.079514087775785, 0.12443075485393747], "isController": false}, {"data": ["register", 24, 6, 25.0, 1371.0000000000002, 178, 2801, 1382.5, 2557.0, 2754.5, 2801.0, 0.10045161371331947, 0.03168542112246307, 0.04532094290581406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19d17595-329f-4533-84c3-c00fcd04b22f", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 448.25, 245, 1462, 365.0, 1170.100000000001, 1462.0, 1462.0, 0.06162726801185298, 6.231520847028282, 0.13728717729137888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 149.42857142857144, 124, 358, 135.5, 251.5, 358.0, 358.0, 0.09796855209477758, 0.0760595692532697, 0.03482475875244047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30e67130-37d8-4a22-ac7d-7f18cd1f6d70", 1, 0, 0.0, 996.0, 996, 996, 996.0, 996.0, 996.0, 996.0, 1.004016064257028, 0.18138962098393574, 0.6922220130522089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 420.31578947368416, 245, 744, 484.0, 737.0, 744.0, 744.0, 0.09215829885481187, 0.14282736355721332, 0.20726617408460132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 140.0, 119, 361, 122.5, 246.0, 361.0, 361.0, 0.06782452825618293, 0.05040475195601095, 0.03404473390984183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 171.42857142857144, 117, 361, 121.0, 358.5, 361.0, 361.0, 0.06774969391656141, 0.01812833606751741, 0.03863849731178893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 175.64285714285714, 119, 372, 122.0, 370.0, 372.0, 372.0, 0.06782222825086473, 0.018280209958240885, 0.039872052155293526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 157.28571428571428, 118, 368, 121.0, 361.5, 368.0, 368.0, 0.06782025694188773, 0.018279678628868177, 0.03993712396089678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 2.2862160852713176, 4.791969476744186], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1359.5423728813557, 943, 2569, 1294.0, 1928.0, 2034.0, 2569.0, 0.25918913338575694, 310.0803122515189, 0.5117972926816411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1371.0000000000002, 178, 2801, 1382.5, 2557.0, 2754.5, 2801.0, 0.09970379663748946, 0.03144953741592685, 0.04498354887355482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 214.0, 116, 372, 124.0, 372.0, 372.0, 372.0, 0.04574853175805889, 0.01233065895041431, 0.026939809228622567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 151.87500000000003, 121, 361, 121.0, 361.0, 361.0, 361.0, 0.04574879337557472, 0.012330729464510373, 0.026895286730562483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 329.0, 120, 1346, 125.0, 1208.5, 1346.0, 1346.0, 0.094948727687049, 12.226940281489068, 0.054653801679236065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 254.50000000000003, 118, 890, 122.5, 810.0, 890.0, 890.0, 0.09494679588473459, 4.010151041701989, 0.054745411187445324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 152.25, 119, 361, 123.5, 361.0, 361.0, 361.0, 0.04574774692346402, 0.01224109634475502, 0.026090511917288072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 139.85714285714283, 118, 364, 122.5, 246.0, 364.0, 364.0, 0.09494679588473459, 0.07056104655105765, 0.04765884090307967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 154.5, 121, 360, 124.0, 360.0, 360.0, 360.0, 0.04574879337557472, 0.033998859139465196, 0.02296374979984903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 156.57142857142858, 119, 373, 121.5, 367.0, 373.0, 373.0, 0.09494808374420986, 0.04577854037667261, 0.05301091394312609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 158.25, 123, 362, 130.5, 362.0, 362.0, 362.0, 0.04638218923933209, 0.03650785598330242, 0.016487418831168832], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 532.0, 125, 969, 503.0, 806.5, 969.0, 969.0, 0.08449157196569641, 0.015789126764515955, 0.05750448295684291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1553.52380952381, 1170, 2677, 1384.0, 2168.6000000000004, 2632.4999999999995, 2677.0, 0.09086739418275597, 0.04703097550474674, 0.04179545181648248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 371.5, 245, 725, 256.0, 725.0, 725.0, 725.0, 0.045715853114963935, 0.07085064345063259, 0.10281602512086128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d91deb2-b5c5-470d-ba57-306360609ee0", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecbf0b91-2493-412e-b1b4-4f48e79a7b88", 3, 0, 0.0, 635.6666666666666, 380, 1058, 469.0, 1058.0, 1058.0, 1058.0, 0.049503316722220386, 0.031825862801557706, 0.0317452909969968], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 1207.9838709677415, 617, 2330, 1011.5, 2119.6, 2201.5499999999997, 2330.0, 0.2814855171161355, 87.98701765101471, 1.0229476669617725], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 207.22033898305088, 117, 762, 126.0, 487.0, 490.0, 762.0, 0.2604960020486465, 0.19359126714748046, 0.12592336036531251], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 758.6610169491524, 571, 1247, 718.0, 994.0, 1120.0, 1247.0, 0.2606766990377053, 76.6476047981081, 0.1311020507855647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0199021-9b5c-4e0c-8c4a-526d1bd4ed9a", 3, 0, 0.0, 351.3333333333333, 288, 451, 315.0, 451.0, 451.0, 451.0, 0.0909118458135095, 0.04113524273462832, 0.05829958862389769], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 188.42372881355934, 117, 496, 126.0, 366.0, 371.0, 496.0, 0.26126888110494595, 0.46232344976773637, 0.1270624050686163], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1149.2372881355939, 820, 1773, 1158.0, 1436.0, 1589.0, 1773.0, 0.2600986611531628, 234.03723251029373, 0.1305573357741462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 140.47368421052633, 121, 376, 127.0, 137.0, 376.0, 376.0, 0.09528968062911251, 0.07118809148561628, 0.03387250366112984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 12, 6.557377049180328, 181.89071038251362, 119, 493, 130.0, 331.59999999999997, 373.4, 466.9599999999999, 0.743434015153054, 1.5948808296601735, 0.35695084144136824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 162.57142857142858, 124, 377, 127.5, 369.0, 377.0, 377.0, 0.06537931678613958, 0.0506306623158288, 0.023240304013823057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fefdbc07-7a17-4b76-9039-3a2f9e61d827", 1, 0, 0.0, 1143.0, 1143, 1143, 1143.0, 1143.0, 1143.0, 1143.0, 0.8748906386701663, 0.15806129702537183, 0.6031960848643919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 146.72222222222223, 121, 360, 128.5, 215.10000000000022, 360.0, 360.0, 0.11638658450635923, 0.09445044113748488, 0.04137179371124488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/156df84c-fcab-4d95-b889-2f1dd26bc37e", 3, 0, 0.0, 311.6666666666667, 222, 489, 224.0, 489.0, 489.0, 489.0, 0.024966503274773014, 0.025202189666364293, 0.01601042039430431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=979bd436-f56b-49bb-95b5-9200fb031dc4", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6bc1e80-0092-494d-a9aa-e59a1a87467f", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 0.20813832085253456, 0.7943008352534562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0199021-9b5c-4e0c-8c4a-526d1bd4ed9a", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecbf0b91-2493-412e-b1b4-4f48e79a7b88", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 349.7142857142857, 242, 730, 252.5, 613.5, 730.0, 730.0, 0.06770775398871215, 0.10493379451180292, 0.15227632562109775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 471.00000000000006, 241, 1469, 250.0, 1331.5, 1469.0, 1469.0, 0.0948676596148373, 16.339551470787537, 0.20989204992071772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03ebf8e6-8d98-40cd-aafa-1f8057b0a005", 3, 0, 0.0, 512.3333333333334, 302, 618, 617.0, 618.0, 618.0, 618.0, 0.04914246400314511, 0.03159386927285534, 0.031513884793683555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 127.46666666666668, 122, 134, 127.0, 133.4, 134.0, 134.0, 0.06854354114211818, 0.05682955706021322, 0.02436508689036232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19d17595-329f-4533-84c3-c00fcd04b22f", 3, 0, 0.0, 358.3333333333333, 237, 508, 330.0, 508.0, 508.0, 508.0, 0.11343441600181495, 0.05132611921957122, 0.07274277328241388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 152.9047619047619, 121, 361, 129.0, 318.20000000000016, 360.9, 361.0, 0.0987013719490701, 0.07662850654249094, 0.035085253310021006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb0655bf-7680-4738-832b-a502b80d0d18", 2, 0, 0.0, 230.5, 225, 236, 230.5, 236.0, 236.0, 236.0, 0.01466942451847614, 0.024811956314453786, 0.009118250689462953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7794532a-835f-4944-bf87-f19e64fb37ec", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/049469d1-472f-40a2-98b4-3d9b3c4fcb52", 3, 0, 0.0, 356.0, 230, 572, 266.0, 572.0, 572.0, 572.0, 0.02660966285557162, 0.0314517206473244, 0.017064139266105498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 149.8421052631579, 119, 383, 123.0, 370.0, 383.0, 383.0, 0.09231995179926727, 0.06860887042894764, 0.04634028830549158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 196.73684210526312, 117, 363, 124.0, 361.0, 363.0, 363.0, 0.09221555142473027, 0.024674864346070406, 0.05259168167191648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 198.0, 120, 366, 124.0, 365.0, 366.0, 366.0, 0.09231860608622558, 0.024882749296677987, 0.05427324303115996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 229.9473684210527, 120, 479, 125.0, 376.0, 479.0, 479.0, 0.09221286612147832, 0.024854249071804703, 0.05430113112426897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3793b83-e612-4ed6-8f6d-bbf2b53c37b9", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.43859649122807015], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07309941520467836], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07309941520467836], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.023391812865497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1368, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

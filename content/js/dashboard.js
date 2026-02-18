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

    var data = {"OkPercent": 66.61442006269593, "KoPercent": 33.38557993730407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5005760368663594, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07be0460-1e15-4783-ab36-865d57046ad7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7bdfc39-4b10-48e5-92f5-6b3a6851b867"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9458f2b2-f0d2-4211-8245-619628734546"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=912d0219-b290-4b34-aa88-7d550f37bb46"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d63d463d-5cb3-4f0c-8116-b9ce317eb5a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7bdfc39-4b10-48e5-92f5-6b3a6851b867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/912d0219-b290-4b34-aa88-7d550f37bb46"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d63d463d-5cb3-4f0c-8116-b9ce317eb5a5"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9458f2b2-f0d2-4211-8245-619628734546"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/791258e1-9922-419a-8e4b-2db7d04b2889"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e25759c2-7c4a-440e-b172-8b0d905263c1"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54d87824-4d45-41c9-b445-8411325624b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e25759c2-7c4a-440e-b172-8b0d905263c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e7b973f-3b54-4b3b-abe9-9081ab15894a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9293478260869565, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=791258e1-9922-419a-8e4b-2db7d04b2889"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e7b973f-3b54-4b3b-abe9-9081ab15894a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd56d56b-55ee-42da-9527-abe2c3720fec"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d83e2ce5-3e05-454f-bf1f-19b2788b992b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54d87824-4d45-41c9-b445-8411325624b6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b223ae6-b3da-4313-9e3f-4215218e132e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b223ae6-b3da-4313-9e3f-4215218e132e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d83e2ce5-3e05-454f-bf1f-19b2788b992b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/debc5143-e814-4065-b466-f063f3ed8d02"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07be0460-1e15-4783-ab36-865d57046ad7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/265aac92-96ea-40bd-b8ab-07a81444506c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=265aac92-96ea-40bd-b8ab-07a81444506c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=debc5143-e814-4065-b466-f063f3ed8d02"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd56d56b-55ee-42da-9527-abe2c3720fec"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 638, 213, 33.38557993730407, 265.4467084639503, 84, 3070, 91.0, 771.5000000000001, 1055.1, 1776.2400000000011, 2.485459284047481, 2.600960826746347, 1.193375178471949], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 60, 100.0, 481.4, 345, 700, 520.5, 625.6, 646.65, 700.0, 0.26428807400066073, 1.7000683088316264, 0.4436632804757185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 121.75000000000001, 86, 273, 90.5, 261.8, 273.0, 273.0, 0.09690333286900486, 0.07523256799888561, 0.03444610660577907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 116.29411764705883, 85, 262, 86.0, 255.6, 262.0, 262.0, 0.08834748625417052, 0.04391491260095, 0.04434629681117544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, 100.0, 99.71428571428572, 84, 255, 87.0, 177.5, 255.0, 255.0, 0.09308386856557758, 0.04626922763660058, 0.04672373871358094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07be0460-1e15-4783-ab36-865d57046ad7", 3, 0, 0.0, 352.6666666666667, 244, 556, 258.0, 556.0, 556.0, 556.0, 0.017014326062544664, 0.023455622029582242, 0.010910879669014644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7bdfc39-4b10-48e5-92f5-6b3a6851b867", 3, 0, 0.0, 303.0, 181, 416, 312.0, 416.0, 416.0, 416.0, 0.03611585967784653, 0.03010830619627766, 0.0231602355355982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.5, 89, 92, 90.5, 92.0, 92.0, 92.0, 0.022305993620485826, 0.006578525462291717, 0.0137887636345386], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 150.7833333333333, 84, 377, 88.0, 346.0, 349.0, 377.0, 0.2664925581953124, 0.13246553918106838, 0.12882208623699185], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 624.5000000000001, 88, 1878, 434.0, 1770.9, 1878.0, 1878.0, 0.08633994193638905, 0.016831651278370767, 0.058167741643912495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 624.5000000000001, 88, 1878, 434.0, 1770.9, 1878.0, 1878.0, 0.08682062858135092, 0.016925359356007988, 0.05849158314703073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 906.5652173913045, 209, 1451, 928.0, 1377.4, 1439.7999999999997, 1451.0, 0.09087281361985926, 0.02835145356991873, 0.04099925770739744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9458f2b2-f0d2-4211-8245-619628734546", 3, 0, 0.0, 322.6666666666667, 165, 435, 368.0, 435.0, 435.0, 435.0, 0.0839278220730172, 0.037155546230242, 0.05382090152468877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=912d0219-b290-4b34-aa88-7d550f37bb46", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d63d463d-5cb3-4f0c-8116-b9ce317eb5a5", 3, 0, 0.0, 405.0, 200, 721, 294.0, 721.0, 721.0, 721.0, 0.016126777977271994, 0.022232065343016565, 0.010341716346102156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7bdfc39-4b10-48e5-92f5-6b3a6851b867", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 93.33333333333333, 88, 101, 92.0, 101.0, 101.0, 101.0, 0.044651495080893625, 0.035145610385937755, 0.015872211142036404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/912d0219-b290-4b34-aa88-7d550f37bb46", 3, 0, 0.0, 274.6666666666667, 192, 383, 249.0, 383.0, 383.0, 383.0, 0.018776874401487127, 0.025885437203873044, 0.012041159691057828], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 534.875, 85, 1212, 507.5, 1015.3000000000002, 1212.0, 1212.0, 0.08675989740642133, 0.0191058172511211, 0.058132943953106274], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d63d463d-5cb3-4f0c-8116-b9ce317eb5a5", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1364.3809523809525, 645, 3070, 1198.0, 2733.6000000000004, 3043.2, 3070.0, 0.08559236027047186, 0.044300733343115316, 0.03936914227284399], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 221.62500000000003, 85, 368, 217.5, 334.40000000000003, 368.0, 368.0, 0.08631711830300547, 0.18951939066858003, 0.054885970366254325], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 109.88888888888889, 85, 280, 87.0, 280.0, 280.0, 280.0, 0.04444883445278546, 0.022094196031706835, 0.022311231356183327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9458f2b2-f0d2-4211-8245-619628734546", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.108368481595092, 4.229773773006134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/791258e1-9922-419a-8e4b-2db7d04b2889", 3, 0, 0.0, 689.0, 189, 1239, 639.0, 1239.0, 1239.0, 1239.0, 0.017469384902957567, 0.0240829573776124, 0.011202698000920053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e25759c2-7c4a-440e-b172-8b0d905263c1", 3, 0, 0.0, 384.6666666666667, 258, 576, 320.0, 576.0, 576.0, 576.0, 0.051427983680186515, 0.031991821879178525, 0.032979533805327935], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 650.9193548387099, 346, 2204, 540.5, 1240.4, 1366.8999999999996, 2204.0, 0.27821030006327035, 0.8880486099581338, 0.5439929852862649], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54d87824-4d45-41c9-b445-8411325624b6", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e25759c2-7c4a-440e-b172-8b0d905263c1", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e7b973f-3b54-4b3b-abe9-9081ab15894a", 3, 0, 0.0, 574.0, 246, 1212, 264.0, 1212.0, 1212.0, 1212.0, 0.08714596949891067, 0.0393745461147422, 0.05588462236746551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 116.42857142857142, 87, 257, 91.0, 257.0, 257.0, 257.0, 0.09806256391577826, 0.0732596302691117, 0.03485817701693681], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 605.6875, 89, 1809, 418.0, 1561.9000000000003, 1809.0, 1809.0, 0.08718538337047795, 0.016996466948566075, 0.05933331448857599], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, 4.3478260869565215, 183.37499999999997, 85, 1910, 91.5, 301.0, 525.0, 1218.9500000000046, 0.754899668090309, 1.6294832424581829, 0.36244928017855016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 112.71428571428572, 87, 266, 90.5, 241.0, 266.0, 266.0, 0.0674897198694556, 0.05226498814109208, 0.023990486359845544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=791258e1-9922-419a-8e4b-2db7d04b2889", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.22926911484771573, 0.8749405139593909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 88.38461538461537, 85, 102, 87.0, 97.6, 102.0, 102.0, 0.06093102607847916, 0.03028700417377529, 0.03058451894954911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e7b973f-3b54-4b3b-abe9-9081ab15894a", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 102.05882352941175, 87, 293, 89.0, 138.59999999999985, 293.0, 293.0, 0.10647026035110134, 0.08640311167164572, 0.037846850359180555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd56d56b-55ee-42da-9527-abe2c3720fec", 1, 0, 0.0, 1456.0, 1456, 1456, 1456.0, 1456.0, 1456.0, 1456.0, 0.6868131868131868, 0.12408246050824176, 0.47352549793956045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 615.6190476190477, 110, 1499, 502.0, 1140.2, 1465.1999999999996, 1499.0, 0.08421728058390647, 0.05173112254616912, 0.0380787118265124], "isController": false}, {"data": ["login", 21, 7, 33.333333333333336, 2260.7619047619046, 1237, 3859, 2059.0, 3500.8000000000006, 3836.8999999999996, 3859.0, 0.08596375604304737, 0.12984108985668613, 0.1286937871230387], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, 100.0, 110.35714285714286, 84, 254, 87.0, 253.5, 254.0, 254.0, 0.06910270142203488, 0.034348901390445066, 0.03468631692473235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83e2ce5-3e05-454f-bf1f-19b2788b992b", 3, 0, 0.0, 523.3333333333334, 256, 855, 459.0, 855.0, 855.0, 855.0, 0.022716258783620064, 0.026849848842228012, 0.014567392514235522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 129.5294117647059, 87, 261, 89.0, 258.6, 261.0, 261.0, 0.08494223927729144, 0.0687667151961666, 0.030194311618099694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54d87824-4d45-41c9-b445-8411325624b6", 3, 0, 0.0, 461.33333333333337, 218, 931, 235.0, 931.0, 931.0, 931.0, 0.017916758738899075, 0.024699698326574735, 0.011489588123577857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 97.25000000000001, 85, 255, 87.0, 139.5000000000001, 255.0, 255.0, 0.09177469312836985, 0.045618475392910404, 0.046066594011701274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b223ae6-b3da-4313-9e3f-4215218e132e", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b223ae6-b3da-4313-9e3f-4215218e132e", 3, 0, 0.0, 452.6666666666667, 290, 680, 388.0, 680.0, 680.0, 680.0, 0.04471605306304964, 0.0287481135415114, 0.028675333507229093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d83e2ce5-3e05-454f-bf1f-19b2788b992b", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 0.19552387716450215, 0.7461613906926406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 90.15384615384616, 86, 101, 89.0, 99.4, 101.0, 101.0, 0.06163328197226502, 0.05110025038520801, 0.02190870570107858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 22, 100.0, 94.5, 85, 252, 87.0, 91.5, 228.14999999999966, 252.0, 0.0977808198477286, 0.048603942678216654, 0.04908138808762939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/debc5143-e814-4065-b466-f063f3ed8d02", 3, 0, 0.0, 321.6666666666667, 206, 447, 312.0, 447.0, 447.0, 447.0, 0.022922285810341007, 0.02313867457612873, 0.01469951271040748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07be0460-1e15-4783-ab36-865d57046ad7", 1, 0, 0.0, 1809.0, 1809, 1809, 1809.0, 1809.0, 1809.0, 1809.0, 0.5527915975677169, 0.09986957573244887, 0.3811238944168049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/265aac92-96ea-40bd-b8ab-07a81444506c", 3, 0, 0.0, 241.66666666666666, 175, 336, 214.0, 336.0, 336.0, 336.0, 0.10460980542576191, 0.0473332127414743, 0.06708376194295279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=265aac92-96ea-40bd-b8ab-07a81444506c", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 113.0909090909091, 86, 257, 90.0, 254.7, 256.7, 257.0, 0.09423294383716548, 0.07315936557670562, 0.03349686675461742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=debc5143-e814-4065-b466-f063f3ed8d02", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd56d56b-55ee-42da-9527-abe2c3720fec", 3, 0, 0.0, 322.66666666666663, 167, 596, 205.0, 596.0, 596.0, 596.0, 0.025846471956577927, 0.03054965484190575, 0.0165747232273628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 127.58823529411762, 85, 259, 87.0, 257.4, 259.0, 259.0, 0.10785775465533103, 0.05361288781207372, 0.05413953700472671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 101.18181818181817, 84, 256, 86.0, 222.20000000000013, 256.0, 256.0, 0.07234034157794014, 0.03595823619450345, 0.0410703555034559], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 906.5652173913045, 209, 1451, 928.0, 1377.4, 1439.7999999999997, 1451.0, 0.09288125736992586, 0.02897806891789297, 0.04190541103994702], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.755868544600939, 1.2539184952978057], "isController": false}, {"data": ["401/Unauthorized", 12, 5.633802816901408, 1.8808777429467085], "isController": false}, {"data": ["404/Not Found", 193, 90.61032863849765, 30.25078369905956], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 638, 213, "404/Not Found", 193, "401/Unauthorized", 12, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

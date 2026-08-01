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

    var data = {"OkPercent": 98.00153727901615, "KoPercent": 1.9984627209838586};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7930354796320631, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/160f01ed-c92b-4109-a5be-55e77c02a994"], "isController": false}, {"data": [0.330188679245283, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97f41bb4-16da-49e2-ae49-5d510e14141f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c3be563-e7b8-4b52-96b3-bd6ef13fe673"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f6d6be99-3a1a-49ff-87ff-67a9b281e720"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13662488-62d9-4a5c-ad89-085bd90f292f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e17ed1ea-236f-4e8e-8fda-a815b915932c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4291472-a0fa-4900-bc40-000d52ef7bd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd0405c-819e-4263-a1a3-ac7cd77871b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac28d504-3bec-4cbd-b1b6-d1eb22164532"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cded7dab-9f1f-4cf2-a51d-8970439e86c4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8a2ab19-371d-4aa6-9f97-869ef7a399eb"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c3be563-e7b8-4b52-96b3-bd6ef13fe673"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f716895f-a890-45a7-a3e4-ecad116a0cd3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=321e41eb-e5d1-4505-96fc-5291f1651b16"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a89a5ca1-6fe9-44b1-b9db-74fcef3f3f73"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b4291472-a0fa-4900-bc40-000d52ef7bd0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97f41bb4-16da-49e2-ae49-5d510e14141f"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8a2ab19-371d-4aa6-9f97-869ef7a399eb"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0ed1de4-1a96-48c8-921a-9f39cd325572"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cded7dab-9f1f-4cf2-a51d-8970439e86c4"], "isController": false}, {"data": [0.32786885245901637, 500, 1500, "addBook"], "isController": true}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13662488-62d9-4a5c-ad89-085bd90f292f"], "isController": false}, {"data": [0.8018867924528302, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da0ba481-cbdf-4de9-97e9-caffd1383f20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e17ed1ea-236f-4e8e-8fda-a815b915932c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac28d504-3bec-4cbd-b1b6-d1eb22164532"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dd0405c-819e-4263-a1a3-ac7cd77871b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0ed1de4-1a96-48c8-921a-9f39cd325572"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a89a5ca1-6fe9-44b1-b9db-74fcef3f3f73"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160f01ed-c92b-4109-a5be-55e77c02a994"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d9c30d0-ab4f-4597-8104-1d3d590b9de5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/321e41eb-e5d1-4505-96fc-5291f1651b16"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 26, 1.9984627209838586, 331.95388162951554, 80, 3190, 102.0, 892.8, 1136.5999999999967, 1952.7600000000011, 5.064799062564478, 701.8831239099587, 3.6916709286957268], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/160f01ed-c92b-4109-a5be-55e77c02a994", 3, 0, 0.0, 799.6666666666666, 440, 1329, 630.0, 1329.0, 1329.0, 1329.0, 0.026176868373980193, 0.02625355841804459, 0.016786598534095372], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1424.2830188679243, 1015, 2230, 1401.0, 1695.4, 1762.0999999999997, 2230.0, 0.23525234142660573, 283.087752868525, 1.156733924885703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97f41bb4-16da-49e2-ae49-5d510e14141f", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 758.0666666666667, 85, 2321, 521.0, 2222.0, 2321.0, 2321.0, 0.09322792362768496, 0.018263204570032818, 0.06277104076546342], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 758.0666666666667, 85, 2321, 521.0, 2222.0, 2321.0, 2321.0, 0.09051302784180737, 0.01773136072760406, 0.06094308163671691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 102.33333333333334, 82, 245, 84.0, 243.2, 245.0, 245.0, 0.0980707307903956, 0.026241582262273824, 0.05593096365389749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 104.94444444444446, 83, 253, 87.0, 247.60000000000002, 253.0, 253.0, 0.09807019646729359, 0.07288224561680705, 0.04922664158612198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 125.05555555555559, 82, 345, 83.5, 257.70000000000016, 345.0, 345.0, 0.09807179945406698, 0.026433414696603992, 0.057751264717580464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c3be563-e7b8-4b52-96b3-bd6ef13fe673", 3, 0, 0.0, 290.6666666666667, 203, 451, 218.0, 451.0, 451.0, 451.0, 0.04645976584278015, 0.028901241056495074, 0.02979353473641826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 120.5, 82, 258, 85.0, 248.10000000000002, 258.0, 258.0, 0.09807126511932004, 0.026433270676691732, 0.05765517734553776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6d6be99-3a1a-49ff-87ff-67a9b281e720", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.5612230887521968, 1.0486461994727594], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 291.40000000000003, 86, 1009, 203.0, 781.6000000000001, 1009.0, 1009.0, 0.09418383428668303, 0.1675993973019471, 0.060876113723840435], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13662488-62d9-4a5c-ad89-085bd90f292f", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 87.92857142857143, 83, 97, 86.0, 96.5, 97.0, 97.0, 0.09562580257370017, 0.07106565992049398, 0.04799967043250185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 120.85714285714285, 82, 272, 85.5, 260.5, 272.0, 272.0, 0.09562906850456629, 0.035847559580325004, 0.05396478544935416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 604.5, 406, 768, 651.5, 768.0, 768.0, 768.0, 0.051607132105657004, 15.174210357121353, 0.029432192529007507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 880.6666666666667, 734, 984, 897.0, 984.0, 984.0, 984.0, 0.051394504214349344, 46.24486523397348, 0.029260738239224284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e17ed1ea-236f-4e8e-8fda-a815b915932c", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 139.16666666666669, 83, 253, 85.0, 253.0, 253.0, 253.0, 0.05171031879411536, 0.09150302505364945, 0.028632569097913486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4291472-a0fa-4900-bc40-000d52ef7bd0", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.57142857142857, 83, 253, 85.0, 251.5, 253.0, 253.0, 0.062234392503422886, 0.0462503639600633, 0.031238747799569696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 96.35714285714286, 81, 250, 84.0, 170.5, 250.0, 250.0, 0.06223605245610136, 0.023329837186041345, 0.03512065181151367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 169.85714285714286, 82, 962, 84.0, 604.0, 962.0, 962.0, 0.062192093607985464, 4.012747886857033, 0.036180389278083064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 159.92857142857144, 83, 485, 87.0, 368.5, 485.0, 485.0, 0.06219264616382431, 1.3217585831404621, 0.03624144573469506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 83.83333333333334, 82, 86, 83.5, 86.0, 86.0, 86.0, 0.05178574511056257, 0.03848530471595519, 0.02907890960798191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 522.1052631578947, 81, 1173, 736.0, 1110.0, 1173.0, 1173.0, 0.09581007417716796, 45.38595504679566, 0.05199232952110091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 168.42857142857142, 82, 754, 85.5, 506.0, 754.0, 754.0, 0.09552336569755938, 6.163342663208493, 0.0555709312163536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 382.3157894736843, 82, 762, 489.0, 732.0, 762.0, 762.0, 0.09580862479325507, 14.83903047974908, 0.052085106108051955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 171.64285714285714, 81, 653, 85.5, 454.5, 653.0, 653.0, 0.09551619681794614, 2.029972364264662, 0.05566003824059165], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 469.00000000000006, 85, 1731, 411.0, 1068.6000000000004, 1731.0, 1731.0, 0.09051248167122246, 0.017731253733639867, 0.06154377334467756], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 304.71428571428567, 167, 1047, 179.0, 773.0, 1047.0, 1047.0, 0.062166410600261096, 5.401795353449348, 0.13867758168222308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 807.8695652173914, 160, 2090, 713.0, 1446.4, 1964.7999999999984, 2090.0, 0.10053238454074184, 0.0617528026134049, 0.045455560588245576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 84.94736842105263, 82, 90, 85.0, 88.0, 90.0, 90.0, 0.09580910791635361, 0.07120188586361825, 0.04809168112207593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 143.0526315789474, 82, 336, 86.0, 263.0, 336.0, 336.0, 0.09580959104432454, 0.10137419003075993, 0.050406402854117294], "isController": false}, {"data": ["login", 23, 0, 0.0, 3084.2173913043475, 1770, 4437, 3059.0, 4003.6000000000004, 4369.599999999999, 4437.0, 0.09790358625093114, 30.688717143769285, 0.19006647733319143], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd0405c-819e-4263-a1a3-ac7cd77871b7", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 93.85714285714286, 84, 121, 91.5, 112.0, 121.0, 121.0, 0.09614724263443444, 0.07783795326557241, 0.03417734015520912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac28d504-3bec-4cbd-b1b6-d1eb22164532", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cded7dab-9f1f-4cf2-a51d-8970439e86c4", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8a2ab19-371d-4aa6-9f97-869ef7a399eb", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 609.3157894736842, 169, 1258, 820.0, 1196.0, 1258.0, 1258.0, 0.0957670944263551, 60.370693276582934, 0.20248617205062552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c3be563-e7b8-4b52-96b3-bd6ef13fe673", 1, 0, 0.0, 1731.0, 1731, 1731, 1731.0, 1731.0, 1731.0, 1731.0, 0.5777007510109763, 0.10436976458694396, 0.3982975880993645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f716895f-a890-45a7-a3e4-ecad116a0cd3", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 259.44444444444446, 168, 599, 175.5, 502.70000000000016, 599.0, 599.0, 0.09802480027446944, 0.151919294956624, 0.2204600732735382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 614.4000000000001, 83, 1068, 854.0, 1066.4, 1068.0, 1068.0, 0.08559591878659226, 61.45064753312562, 0.13849152172424417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=321e41eb-e5d1-4505-96fc-5291f1651b16", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a89a5ca1-6fe9-44b1-b9db-74fcef3f3f73", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1186.1666666666665, 149, 2478, 1152.5, 2047.5, 2384.5, 2478.0, 0.10099182387025918, 0.031707882201453444, 0.04556467053521459], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b4291472-a0fa-4900-bc40-000d52ef7bd0", 3, 0, 0.0, 980.3333333333334, 209, 2049, 683.0, 2049.0, 2049.0, 2049.0, 0.019220419773967864, 0.026496900306886034, 0.01232559471182184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 293.0, 167, 851, 254.0, 600.0, 851.0, 851.0, 0.09545888449474976, 8.294661920002046, 0.21294469350879586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 102.61538461538461, 85, 248, 89.0, 189.19999999999993, 248.0, 248.0, 0.07323407299747062, 0.05685653128221595, 0.026032424385819628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97f41bb4-16da-49e2-ae49-5d510e14141f", 3, 0, 0.0, 337.66666666666663, 197, 613, 203.0, 613.0, 613.0, 613.0, 0.029079911597068745, 0.02916510665057578, 0.01864825060098484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 368.93749999999994, 170, 1052, 335.0, 882.6000000000001, 1052.0, 1052.0, 0.07488112621213823, 11.299527210514245, 0.16601452810850276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 85.61538461538461, 83, 90, 85.0, 89.2, 90.0, 90.0, 0.06947302041972393, 0.05162985208926749, 0.034872199702869235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 136.6153846153846, 83, 255, 88.0, 253.4, 255.0, 255.0, 0.06947413424540402, 0.018589758577383497, 0.03962196718683198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 98.61538461538461, 80, 267, 84.0, 197.79999999999995, 267.0, 267.0, 0.06947450552856738, 0.018725550318246676, 0.04084341047675543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 124.3076923076923, 82, 263, 87.0, 255.79999999999998, 263.0, 263.0, 0.06947450552856738, 0.018725550318246676, 0.04091125667356067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.0838679917809368, 0.02473450538851847, 0.051844178513020506], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 963.8113207547171, 651, 1855, 894.0, 1332.6000000000001, 1397.2999999999997, 1855.0, 0.23057914520395378, 275.85281994487855, 0.45530374179921346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8a2ab19-371d-4aa6-9f97-869ef7a399eb", 3, 0, 0.0, 335.6666666666667, 203, 428, 376.0, 428.0, 428.0, 428.0, 0.02935765451912162, 0.02447426862743179, 0.018826360482639838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1186.1666666666665, 149, 2478, 1152.5, 2047.5, 2384.5, 2478.0, 0.09989427855519574, 0.03136329155810101, 0.04506948895751996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 107.0, 81, 246, 84.0, 246.0, 246.0, 246.0, 0.040247695819414335, 0.01084801176382652, 0.02370054744053403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 130.85714285714286, 84, 247, 86.0, 247.0, 247.0, 247.0, 0.040247233002731066, 0.010847887020267356, 0.023660970964496188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 237.7692307692308, 81, 900, 85.0, 850.8, 900.0, 900.0, 0.06970322511460818, 9.664986779845044, 0.04005631551432937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 185.15384615384613, 81, 657, 86.0, 654.6, 657.0, 657.0, 0.0697035988504268, 3.169000396774332, 0.04012460020964698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 98.23076923076923, 82, 252, 85.0, 187.59999999999994, 252.0, 252.0, 0.06970098278385725, 0.051799265525893916, 0.03498662612392835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 155.57142857142858, 82, 258, 86.0, 258.0, 258.0, 258.0, 0.04024746440974219, 0.010769341062763045, 0.02295363204618109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 121.46153846153847, 82, 249, 84.0, 248.2, 249.0, 249.0, 0.06970285138279735, 0.034757176042593804, 0.03885179967400513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 138.71428571428572, 84, 296, 86.0, 296.0, 296.0, 296.0, 0.04020954919351133, 0.029882291929943478, 0.02018330887252424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 114.57142857142857, 84, 268, 91.0, 268.0, 268.0, 268.0, 0.04066835537170877, 0.03201044377890358, 0.014456329448537102], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 428.5333333333333, 83, 683, 443.0, 641.0, 683.0, 683.0, 0.09250522654529982, 0.01778437070236135, 0.06295293835143352], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1673.1304347826087, 1175, 3190, 1400.0, 2355.6, 3025.9999999999977, 3190.0, 0.09862144373217846, 0.05104430193169393, 0.045362011716656304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 318.5714285714286, 171, 545, 330.0, 545.0, 545.0, 545.0, 0.040189926107950136, 0.06228653587237976, 0.09038808576817302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0ed1de4-1a96-48c8-921a-9f39cd325572", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cded7dab-9f1f-4cf2-a51d-8970439e86c4", 3, 0, 0.0, 366.6666666666667, 271, 552, 277.0, 552.0, 552.0, 552.0, 0.08482243836236146, 0.039870963865641255, 0.054394597517529966], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 948.1311475409836, 437, 2286, 763.0, 1656.4, 2013.3999999999996, 2286.0, 0.27384960718294055, 87.03070636924804, 0.9944891624579124], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 157.92452830188677, 83, 594, 88.0, 352.8, 395.0999999999998, 594.0, 0.2313208420078649, 0.17190933668748554, 0.11182013358778627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13662488-62d9-4a5c-ad89-085bd90f292f", 3, 0, 0.0, 576.3333333333334, 328, 1009, 392.0, 1009.0, 1009.0, 1009.0, 0.022534703443302686, 0.026635256576377626, 0.01445096542425335], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 527.7169811320756, 404, 752, 491.0, 678.6, 731.0999999999999, 752.0, 0.23146328468237123, 68.05789100099136, 0.11640975743302849], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 134.32075471698113, 82, 266, 88.0, 250.0, 258.2, 266.0, 0.23187340587033464, 0.4103072377314906, 0.11276655871428383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da0ba481-cbdf-4de9-97e9-caffd1383f20", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 804.2641509433962, 566, 1226, 802.0, 1014.6, 1100.3, 1226.0, 0.2312118554969528, 208.04483400324787, 0.11605751340374389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 90.06250000000001, 84, 102, 87.5, 99.2, 102.0, 102.0, 0.07486991352524988, 0.055933089694156404, 0.026613914573428668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 175.89714285714282, 84, 1746, 92.0, 322.8, 455.7999999999992, 1211.7200000000064, 0.7014730934963422, 1.4956917338911715, 0.33931412215652873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 92.07692307692308, 84, 104, 91.0, 102.8, 104.0, 104.0, 0.07077680263071931, 0.054810551256016034, 0.025158941560138506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e17ed1ea-236f-4e8e-8fda-a815b915932c", 3, 0, 0.0, 430.0, 239, 644, 407.0, 644.0, 644.0, 644.0, 0.09225943352707815, 0.041744991081588086, 0.05916376433865362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 108.05555555555557, 85, 262, 89.0, 253.0, 262.0, 262.0, 0.09838592425377009, 0.07984248345203412, 0.03497312151208234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac28d504-3bec-4cbd-b1b6-d1eb22164532", 3, 0, 0.0, 302.3333333333333, 203, 498, 206.0, 498.0, 498.0, 498.0, 0.06461757167165658, 0.02923776843216232, 0.041437700583712066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 238.3846153846154, 169, 354, 180.0, 348.4, 354.0, 354.0, 0.069441847794153, 0.10762130122003985, 0.15617634323235777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 350.53846153846155, 166, 984, 177.0, 936.4, 984.0, 984.0, 0.06966960529489, 12.914296546330288, 0.15394617185615905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd0405c-819e-4263-a1a3-ac7cd77871b7", 3, 0, 0.0, 361.3333333333333, 236, 464, 384.0, 464.0, 464.0, 464.0, 0.017956222728986733, 0.0247541026228056, 0.011514895434929642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0ed1de4-1a96-48c8-921a-9f39cd325572", 3, 0, 0.0, 359.0, 187, 489, 401.0, 489.0, 489.0, 489.0, 0.04195393457983135, 0.03497526902960549, 0.026904053099696533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 89.42857142857143, 83, 101, 87.5, 100.0, 101.0, 101.0, 0.06016511025256453, 0.049882986918386024, 0.0213868165350913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 93.15789473684211, 86, 125, 90.0, 105.0, 125.0, 125.0, 0.09869976052321262, 0.07662725548433012, 0.03508468049848574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a89a5ca1-6fe9-44b1-b9db-74fcef3f3f73", 3, 0, 0.0, 277.3333333333333, 189, 443, 200.0, 443.0, 443.0, 443.0, 0.02961354326045111, 0.024398397783919844, 0.018990455801786682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160f01ed-c92b-4109-a5be-55e77c02a994", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d9c30d0-ab4f-4597-8104-1d3d590b9de5", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 114.56249999999999, 83, 357, 86.0, 280.70000000000005, 357.0, 357.0, 0.07491267990748285, 0.055672411532807074, 0.03760265378168572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 137.43750000000003, 82, 260, 88.0, 256.5, 260.0, 260.0, 0.07491443367029221, 0.03411020966677124, 0.04193818271630372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 241.93749999999994, 84, 961, 168.0, 795.8000000000002, 961.0, 961.0, 0.07491548596739303, 8.443803801609747, 0.04323735567063406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 186.625, 82, 660, 87.5, 651.6, 660.0, 660.0, 0.07491513519840805, 2.771110119395997, 0.04331031253657966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/321e41eb-e5d1-4505-96fc-5291f1651b16", 3, 0, 0.0, 276.3333333333333, 180, 400, 249.0, 400.0, 400.0, 400.0, 0.07594167679222356, 0.034361631100648035, 0.0486995778908465], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5380476556495004], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.15372790161414296], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1529592621060722], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 99.46969696969697, "KoPercent": 0.5303030303030303};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7416721097322012, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2b358b-2a70-4111-b273-588603db0b72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a20f2d9e-3743-4f30-9573-401e34bff6d3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8035d42c-b59f-418d-8a98-9917431f14de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/ad9d458d-5a11-4c9a-883d-940ad950b1bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70922510-4269-494c-a0f4-c2f512497dc3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c40678a-da8c-464e-92c6-8d3369b3d127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/599b29d4-f93d-44e4-a950-a6d59237cc3c"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/794ca810-049f-43b9-a016-f568bf018c7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ee25cdd-fa74-4120-83a0-ab7d3f1310ed"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5d9c1406-eccf-4cf4-b80d-bc6407fc9ce3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32484b47-9705-4f00-8543-a76ea237929e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7242fd5-2742-4110-bd26-16a7de6413a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8569b8d4-32f5-45dd-b929-5a0e969c9d9a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68ba8c35-8f94-4130-ad9f-572b0d801ab6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/231b4050-9fcd-44f8-be4b-0dab189f9609"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78f1832d-aa64-4f58-a2bd-134145deb59d"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac2b358b-2a70-4111-b273-588603db0b72"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bdd1a64-0ce5-46c0-b468-7ed3c3b00487"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c40678a-da8c-464e-92c6-8d3369b3d127"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a20f2d9e-3743-4f30-9573-401e34bff6d3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8569b8d4-32f5-45dd-b929-5a0e969c9d9a"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70922510-4269-494c-a0f4-c2f512497dc3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8035d42c-b59f-418d-8a98-9917431f14de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad9d458d-5a11-4c9a-883d-940ad950b1bd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=599b29d4-f93d-44e4-a950-a6d59237cc3c"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=794ca810-049f-43b9-a016-f568bf018c7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4576271186440678, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d9c1406-eccf-4cf4-b80d-bc6407fc9ce3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68ba8c35-8f94-4130-ad9f-572b0d801ab6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=231b4050-9fcd-44f8-be4b-0dab189f9609"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/827db5ab-c2bf-4c41-9300-ed97bdd00e1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bdd1a64-0ce5-46c0-b468-7ed3c3b00487"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 7, 0.5303030303030303, 461.6689393939394, 124, 3411, 149.0, 1277.2000000000007, 1516.0, 2180.37, 5.174502248164424, 744.3645326275397, 3.7775573789088073], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2094.8983050847473, 1530, 2915, 2079.0, 2538.0, 2774.0, 2915.0, 0.2596888135742424, 312.49295071414423, 1.2768878675256938], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2b358b-2a70-4111-b273-588603db0b72", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a20f2d9e-3743-4f30-9573-401e34bff6d3", 3, 0, 0.0, 327.0, 253, 474, 254.0, 474.0, 474.0, 474.0, 0.05759373380176237, 0.037027221438307514, 0.036933481637197875], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 812.1538461538461, 501, 2181, 678.0, 1755.7999999999997, 2181.0, 2181.0, 0.0900532699727762, 0.016269389594691014, 0.06120808193462132], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 812.1538461538461, 501, 2181, 678.0, 1755.7999999999997, 2181.0, 2181.0, 0.08777023103825432, 0.015856926505934617, 0.05965632890881348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8035d42c-b59f-418d-8a98-9917431f14de", 3, 0, 0.0, 436.66666666666663, 244, 712, 354.0, 712.0, 712.0, 712.0, 0.020212636940615272, 0.02389065258182749, 0.012961879808923205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 207.9375, 127, 393, 129.0, 391.6, 393.0, 393.0, 0.07884725315881809, 0.04330246483905304, 0.043725960827699036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad9d458d-5a11-4c9a-883d-940ad950b1bd", 3, 0, 0.0, 1137.0, 523, 2085, 803.0, 2085.0, 2085.0, 2085.0, 0.02666856309782029, 0.02223248375440031, 0.01710191058030793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 163.00000000000003, 126, 380, 131.5, 378.6, 380.0, 380.0, 0.07884608750930137, 0.05859557870564292, 0.03957704001931729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 354.9375, 126, 1180, 136.5, 1075.7, 1180.0, 1180.0, 0.07884725315881809, 4.36421278717648, 0.04516007224379571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 453.3125, 125, 1505, 376.5, 1431.5, 1505.0, 1505.0, 0.0788484188428009, 13.320007193378212, 0.045083739484824144], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 304.3846153846155, 233, 523, 258.0, 485.79999999999995, 523.0, 523.0, 0.09049836754867768, 0.21252024248341445, 0.05850578058322717], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 129.20000000000002, 126, 136, 129.0, 133.6, 136.0, 136.0, 0.07544057294600467, 0.05606472266788042, 0.0378676313420375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 164.26666666666665, 125, 410, 128.0, 394.40000000000003, 410.0, 410.0, 0.07544057294600467, 0.020186247057817654, 0.04302470175826829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 903.0, 749, 1033, 927.0, 1033.0, 1033.0, 1033.0, 0.04742108341368573, 13.943373051783823, 0.02704483663436764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1428.3333333333333, 1385, 1515, 1385.0, 1515.0, 1515.0, 1515.0, 0.04694909153507879, 42.244875090963866, 0.026729805043897402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 217.33333333333331, 127, 394, 131.0, 394.0, 394.0, 394.0, 0.04768868824314872, 0.08438662411775927, 0.026405748275259107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 148.78571428571425, 127, 385, 131.0, 259.5, 385.0, 385.0, 0.07333797807194456, 0.05450214971948224, 0.036812227274394045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 148.8571428571429, 127, 383, 130.0, 263.5, 383.0, 383.0, 0.07333951480672418, 0.027492086535388933, 0.041386486801506604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 229.71428571428567, 126, 1513, 129.0, 827.5, 1513.0, 1513.0, 0.07334028319826498, 4.7320495154957545, 0.042665873456579934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 210.71428571428572, 127, 1000, 130.0, 692.0, 1000.0, 1000.0, 0.07334028319826498, 1.558675418825403, 0.04273749482689074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70922510-4269-494c-a0f4-c2f512497dc3", 3, 0, 0.0, 1088.3333333333333, 258, 2509, 498.0, 2509.0, 2509.0, 2509.0, 0.020884674825612962, 0.024684978610612203, 0.013392841603664565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c40678a-da8c-464e-92c6-8d3369b3d127", 3, 0, 0.0, 375.0, 244, 531, 350.0, 531.0, 531.0, 531.0, 0.017056890415164713, 0.023514300425853698, 0.010938175168578933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 133.33333333333334, 130, 138, 132.0, 138.0, 138.0, 138.0, 0.047888897757203286, 0.035589307805890334, 0.02689073848671083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 845.0000000000001, 128, 1635, 1298.0, 1601.0, 1635.0, 1635.0, 0.11435794035330585, 54.17221920235336, 0.06205752129164284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 147.93333333333334, 126, 383, 130.0, 238.4000000000001, 383.0, 383.0, 0.07543602019673715, 0.020332364818651808, 0.04434812906097242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 590.0, 128, 1150, 748.0, 1131.0, 1150.0, 1150.0, 0.11436069362770176, 17.71241182188623, 0.062170695749393594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 215.73333333333332, 128, 398, 135.0, 388.4, 398.0, 398.0, 0.07543753771876886, 0.02033277383826192, 0.044422690668376584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/599b29d4-f93d-44e4-a950-a6d59237cc3c", 3, 0, 0.0, 881.0, 239, 1501, 903.0, 1501.0, 1501.0, 1501.0, 0.01485251453071005, 0.020475390311704773, 0.00952456172705039], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 742.9230769230769, 506, 1130, 704.0, 1076.3999999999999, 1130.0, 1130.0, 0.08765482876966334, 0.015836077463269257, 0.06043389561658429], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/794ca810-049f-43b9-a016-f568bf018c7d", 3, 0, 0.0, 404.6666666666667, 233, 496, 485.0, 496.0, 496.0, 496.0, 0.04929994084007099, 0.031245763286334056, 0.03161487091632157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ee25cdd-fa74-4120-83a0-ab7d3f1310ed", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 417.35714285714283, 256, 1898, 267.5, 1206.5, 1898.0, 1898.0, 0.07328845288075969, 6.368217505405023, 0.16348805267345806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 763.9999999999999, 308, 1422, 716.0, 1372.8, 1418.3999999999999, 1422.0, 0.09084970430584337, 0.05580514063317917, 0.0410775518492241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 144.05263157894737, 126, 379, 130.0, 142.0, 379.0, 379.0, 0.11435105774728416, 0.0849815966266438, 0.057398870783304745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 182.89473684210526, 124, 397, 129.0, 383.0, 397.0, 397.0, 0.11436138196701577, 0.1210034646984471, 0.06016668923799206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d9c1406-eccf-4cf4-b80d-bc6407fc9ce3", 3, 0, 0.0, 556.0, 258, 876, 534.0, 876.0, 876.0, 876.0, 0.03336929802120062, 0.027818610752700132, 0.02139893134823087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32484b47-9705-4f00-8543-a76ea237929e", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["login", 21, 0, 0.0, 3517.4761904761904, 2234, 5571, 3388.0, 5429.200000000001, 5570.5, 5571.0, 0.09094806865279925, 15.671476391667857, 0.1587657900463835], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b7242fd5-2742-4110-bd26-16a7de6413a9", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 151.73333333333332, 128, 386, 136.0, 240.2000000000001, 386.0, 386.0, 0.07295365011429406, 0.05906110932104469, 0.025932742814065463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8569b8d4-32f5-45dd-b929-5a0e969c9d9a", 1, 0, 0.0, 996.0, 996, 996, 996.0, 996.0, 996.0, 996.0, 1.004016064257028, 0.18138962098393574, 0.6922220130522089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ba8c35-8f94-4130-ad9f-572b0d801ab6", 3, 0, 0.0, 454.33333333333337, 246, 848, 269.0, 848.0, 848.0, 848.0, 0.03571173487608028, 0.02902740950051187, 0.02290107998238221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/231b4050-9fcd-44f8-be4b-0dab189f9609", 3, 0, 0.0, 641.3333333333334, 285, 1004, 635.0, 1004.0, 1004.0, 1004.0, 0.018215931653824433, 0.021530614529634284, 0.01168144054623507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78f1832d-aa64-4f58-a2bd-134145deb59d", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 990.315789473684, 258, 1767, 1441.0, 1729.0, 1767.0, 1767.0, 0.11425959780621572, 72.0281968914624, 0.2415859927505292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2b358b-2a70-4111-b273-588603db0b72", 3, 0, 0.0, 547.6666666666666, 252, 709, 682.0, 709.0, 709.0, 709.0, 0.046355671616422275, 0.029802230287250646, 0.029726781602979126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bdd1a64-0ce5-46c0-b468-7ed3c3b00487", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 635.6875, 255, 1638, 513.5, 1563.1000000000001, 1638.0, 1638.0, 0.07879599716334411, 17.774359928726557, 0.17343391416653534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1562.3333333333333, 1516, 1654, 1517.0, 1654.0, 1654.0, 1654.0, 0.046852305914322746, 56.05164637050803, 0.10564645933219846], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1483.0454545454545, 288, 2603, 1486.5, 2219.3, 2548.0999999999995, 2603.0, 0.08949528725953226, 0.028443992222045942, 0.04037775655654678], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c40678a-da8c-464e-92c6-8d3369b3d127", 1, 0, 0.0, 1130.0, 1130, 1130, 1130.0, 1130.0, 1130.0, 1130.0, 0.8849557522123894, 0.15987970132743365, 0.6101355088495576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 366.13333333333344, 258, 541, 270.0, 533.2, 541.0, 541.0, 0.07538673394513856, 0.11683471364349111, 0.16954653151919347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 24, 0, 0.0, 136.50000000000003, 129, 151, 136.0, 145.0, 150.0, 151.0, 0.1286063360054872, 0.09984573937926007, 0.045715533501950525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a20f2d9e-3743-4f30-9573-401e34bff6d3", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 536.1428571428572, 255, 1517, 281.5, 1513.0, 1517.0, 1517.0, 0.09563102817016858, 16.47103041579005, 0.21158098155004237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 155.90909090909093, 128, 382, 133.0, 334.00000000000017, 382.0, 382.0, 0.0503282776290806, 0.037402167261455406, 0.025262436231784594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 153.63636363636365, 128, 378, 131.0, 330.60000000000014, 378.0, 378.0, 0.0503305804031022, 0.013467362334423829, 0.02870415913614422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 177.09090909090907, 125, 394, 130.0, 393.2, 394.0, 394.0, 0.05027100642554864, 0.013549607200636157, 0.029553853386894806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 221.36363636363637, 128, 387, 131.0, 385.4, 387.0, 387.0, 0.050271695664294756, 0.013549792972016946, 0.029603352036689196], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1419.3050847457623, 1011, 2362, 1305.0, 1954.0, 2225.0, 2362.0, 0.2589422865920562, 309.7849976684222, 0.5113098666886109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1483.0454545454545, 288, 2603, 1486.5, 2219.3, 2548.0999999999995, 2603.0, 0.09019202702481101, 0.02866543472557026, 0.04069210594283465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 258.25, 128, 387, 259.0, 387.0, 387.0, 387.0, 0.025316776161723564, 0.006823662324839556, 0.014908218774921203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 129.0, 125, 137, 127.0, 137.0, 137.0, 137.0, 0.025358505876833737, 0.0068349097871153435, 0.01490802786899796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 24, 0, 0.0, 232.66666666666669, 125, 1333, 131.0, 387.0, 1097.5, 1333.0, 0.1282249921195057, 4.840498669999627, 0.07492313178857836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8569b8d4-32f5-45dd-b929-5a0e969c9d9a", 2, 0, 0.0, 410.0, 390, 430, 410.0, 430.0, 430.0, 430.0, 0.02241473993297993, 0.03149883863628722, 0.013932599577482151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 24, 0, 0.0, 216.25, 126, 1045, 129.5, 460.5, 916.0, 1045.0, 0.12842259595575842, 1.606526125302997, 0.0751640063569185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 257.0, 127, 389, 256.0, 389.0, 389.0, 389.0, 0.025316135238794446, 0.006774043999443044, 0.014438108378374956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 24, 0, 0.0, 162.49999999999997, 127, 394, 131.0, 379.0, 390.25, 394.0, 0.12905237913438117, 0.09590709035279694, 0.06477824499518742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 196.5, 128, 381, 138.5, 381.0, 381.0, 381.0, 0.025356416124145013, 0.01884397721726011, 0.012727732312314976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 24, 0, 0.0, 171.45833333333334, 127, 393, 128.5, 385.5, 392.75, 393.0, 0.12905654289785712, 0.04260924434705455, 0.07315094574247842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 136.5, 131, 144, 135.5, 144.0, 144.0, 144.0, 0.02686294525331757, 0.021144076048998012, 0.009548937570515231], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 697.3333333333333, 474, 1004, 710.5, 973.7, 1004.0, 1004.0, 0.09005696102785012, 0.01627005643569558, 0.06129853694962064], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1968.0476190476188, 1182, 3411, 1807.0, 2849.0, 3359.0999999999995, 3411.0, 0.0920511629130248, 0.04764366830459292, 0.04233993919144012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 457.75, 268, 769, 397.0, 769.0, 769.0, 769.0, 0.025293883306669363, 0.03920057891375418, 0.0568865363820894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70922510-4269-494c-a0f4-c2f512497dc3", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8035d42c-b59f-418d-8a98-9917431f14de", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad9d458d-5a11-4c9a-883d-940ad950b1bd", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=599b29d4-f93d-44e4-a950-a6d59237cc3c", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 1378.9310344827582, 657, 2574, 1123.0, 2323.0, 2501.95, 2574.0, 0.2741072610068243, 97.16125360208841, 0.9949726202881907], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 227.406779661017, 126, 818, 133.0, 534.0, 556.0, 818.0, 0.2606559694634905, 0.19371014918136353, 0.12600068836369901], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 798.9491525423728, 624, 1145, 756.0, 1035.0, 1125.0, 1145.0, 0.26074236444711574, 76.66691260877155, 0.13113507586939901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=794ca810-049f-43b9-a016-f568bf018c7d", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 198.135593220339, 127, 405, 136.0, 386.0, 395.0, 405.0, 0.261190230599985, 0.4621842752413796, 0.12702415511600829], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1189.2033898305087, 875, 1790, 1161.0, 1497.0, 1644.0, 1790.0, 0.25991074929185337, 233.8681490871736, 0.13046301282813733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 139.21428571428572, 130, 160, 138.0, 155.0, 160.0, 160.0, 0.09695358001094191, 0.07243114131676812, 0.0344639678945145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 221.85142857142864, 128, 1315, 141.0, 406.20000000000005, 455.59999999999917, 836.2000000000057, 0.7119841166514776, 1.5709262048805495, 0.34076306770562104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 161.45454545454547, 130, 385, 139.0, 339.20000000000016, 385.0, 385.0, 0.0483064208016231, 0.03740917157781945, 0.017171423019326962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 135.18750000000003, 128, 152, 134.5, 146.4, 152.0, 152.0, 0.07815896556609074, 0.06342783240763808, 0.027783069791071313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 380.9090909090909, 259, 772, 272.0, 722.0000000000002, 772.0, 772.0, 0.050238633509168545, 0.07786006970610398, 0.11298786423009294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 24, 0, 0.0, 435.9166666666667, 257, 1461, 266.5, 779.5, 1292.25, 1461.0, 0.1281339426814163, 6.5775058944950455, 0.28681022895933883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d9c1406-eccf-4cf4-b80d-bc6407fc9ce3", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68ba8c35-8f94-4130-ad9f-572b0d801ab6", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=231b4050-9fcd-44f8-be4b-0dab189f9609", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/827db5ab-c2bf-4c41-9300-ed97bdd00e1f", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.6597849948347108, 1.232809271694215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 134.85714285714283, 130, 144, 133.0, 143.0, 144.0, 144.0, 0.07528014969995483, 0.06241488974146645, 0.02675974071365582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 148.89473684210526, 129, 383, 134.0, 151.0, 383.0, 383.0, 0.11116832053922486, 0.08630743635613648, 0.03951686394167759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bdd1a64-0ce5-46c0-b468-7ed3c3b00487", 3, 0, 0.0, 402.6666666666667, 321, 525, 362.0, 525.0, 525.0, 525.0, 0.0402565685300985, 0.02588109467673975, 0.025815572918064463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 149.71428571428572, 127, 388, 129.5, 263.5, 388.0, 388.0, 0.09572125969177755, 0.0711366002201589, 0.04804758543122427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 202.14285714285717, 125, 395, 127.5, 391.5, 395.0, 395.0, 0.09589303816542918, 0.04623414340118907, 0.05353849591769637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 345.35714285714283, 126, 1389, 131.0, 1385.0, 1389.0, 1389.0, 0.095885813693864, 12.347612721479107, 0.05519320135335977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 292.99999999999994, 126, 1003, 132.5, 880.5, 1003.0, 1003.0, 0.0958904109589041, 4.050005351027397, 0.05528949058219178], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.30303030303030304], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.22727272727272727], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

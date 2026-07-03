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

    var data = {"OkPercent": 98.05982215036379, "KoPercent": 1.9401778496362168};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7136426592797784, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10e96442-dcdd-4df2-84d5-2429f15dfe1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85dcdb3-fdcf-42c8-83d7-d3be6ae63554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eef9425b-6892-41e8-a369-8f798510acce"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e609af85-ed4f-4e67-917e-7e6e1d870bbe"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2763f1ae-057e-4318-804f-fb41edafaef9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09fe1e5d-016d-4e36-85a4-5435402c0789"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7230a2c4-6b13-46b1-9278-3da8b1e1fc3b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29441822-c9b5-4e70-93da-38f08196e345"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9744c403-7491-4c78-afcb-6026e42a9e1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10e96442-dcdd-4df2-84d5-2429f15dfe1d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5ae096d1-ff03-453f-b8e3-8d98d4476856"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/02f13617-9af5-44c0-8da9-f524f1be4d1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a89b1b8-98ea-4a8c-8d9d-9e598fbe142d"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b63d0db-a069-43f8-9773-bfcfa1c5a892"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c173f059-9547-4bf5-8e44-8e70846c7c1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2169811320754717, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/523e1df1-e26c-402f-825a-9418a498566b"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33eea7f5-6e33-4734-a84c-1de44257aeb7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2763f1ae-057e-4318-804f-fb41edafaef9"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/94c28c46-7d67-47cc-8d61-0b37d6e9fb05"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eef9425b-6892-41e8-a369-8f798510acce"], "isController": false}, {"data": [0.9141104294478528, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7230a2c4-6b13-46b1-9278-3da8b1e1fc3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e609af85-ed4f-4e67-917e-7e6e1d870bbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ae096d1-ff03-453f-b8e3-8d98d4476856"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09fe1e5d-016d-4e36-85a4-5435402c0789"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b85dcdb3-fdcf-42c8-83d7-d3be6ae63554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de588f76-b5e0-4bae-aac6-6692d69b553f"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29441822-c9b5-4e70-93da-38f08196e345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ed64b46-9d93-480e-83af-8c2df62e5427"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b63d0db-a069-43f8-9773-bfcfa1c5a892"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a89b1b8-98ea-4a8c-8d9d-9e598fbe142d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1237, 24, 1.9401778496362168, 490.9070331447048, 137, 3679, 156.0, 1404.2, 1677.1, 2218.2599999999975, 4.855397852163537, 679.3526480157929, 3.5328442507006375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2367.679245283018, 1726, 3369, 2341.0, 2867.6, 3016.5, 3369.0, 0.24896304542870967, 299.58625307093564, 1.2241493493491729], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 691.5384615384615, 145, 1408, 589.0, 1308.8, 1408.0, 1408.0, 0.08253339428107065, 0.016361600624079434, 0.05548932382929555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 691.5384615384615, 145, 1408, 589.0, 1308.8, 1408.0, 1408.0, 0.08323888920903846, 0.01650145948186993, 0.05596364621551189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10e96442-dcdd-4df2-84d5-2429f15dfe1d", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 182.78571428571428, 138, 434, 143.0, 425.0, 434.0, 434.0, 0.14075302870356407, 0.06786306741064696, 0.07858448951892626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 143.07142857142856, 138, 147, 143.5, 147.0, 147.0, 147.0, 0.14075161361671323, 0.10460154097882694, 0.07065071230370178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 352.2857142857142, 138, 1129, 147.0, 1050.0, 1129.0, 1129.0, 0.14075585896262932, 5.9449320978655384, 0.08115847727295578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 406.42857142857144, 140, 1573, 145.0, 1555.0, 1573.0, 1573.0, 0.14075302870356407, 18.125349526215253, 0.08101939124315086], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 280.28571428571433, 144, 556, 248.0, 476.5, 556.0, 556.0, 0.06624208643645964, 0.12198136438588854, 0.0428152324860655], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 159.17647058823528, 138, 413, 144.0, 204.19999999999982, 413.0, 413.0, 0.0998302885095338, 0.07419028276929221, 0.050110125287012086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1069.5, 861, 1155, 1131.0, 1155.0, 1155.0, 1155.0, 0.025964752848008827, 7.634499448249001, 0.014808023108630034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 225.47058823529412, 138, 441, 143.0, 437.0, 441.0, 441.0, 0.09966991668767552, 0.026669489426194428, 0.05684299936093995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1356.25, 1012, 1625, 1394.0, 1625.0, 1625.0, 1625.0, 0.02592436566317768, 23.326789793901295, 0.014759673028938075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85dcdb3-fdcf-42c8-83d7-d3be6ae63554", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 286.25, 138, 441, 283.0, 441.0, 441.0, 441.0, 0.02608310075901823, 0.04615486188998148, 0.014442498174182947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 167.58333333333334, 142, 417, 145.0, 336.60000000000025, 417.0, 417.0, 0.05689576695493855, 0.042282889309285386, 0.02855900802230314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 260.25, 140, 434, 143.5, 433.7, 434.0, 434.0, 0.05689684601816906, 0.015224351375955394, 0.032448982494737044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 167.66666666666666, 139, 428, 143.5, 347.60000000000025, 428.0, 428.0, 0.05689576695493855, 0.01533518718707328, 0.03344848799499317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 237.16666666666666, 140, 432, 145.5, 430.5, 432.0, 432.0, 0.05689576695493855, 0.01533518718707328, 0.0335040502674101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 215.75, 140, 433, 145.0, 433.0, 433.0, 433.0, 0.026133200925115313, 0.01942125576563745, 0.01467440481634893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eef9425b-6892-41e8-a369-8f798510acce", 3, 0, 0.0, 439.6666666666667, 238, 577, 504.0, 577.0, 577.0, 577.0, 0.023333048151633704, 0.027578872994330067, 0.014962924758697392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1013.3529411764708, 141, 1735, 1516.0, 1727.8, 1735.0, 1735.0, 0.08187759780760691, 43.346502607440264, 0.04399603917120606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 159.0, 137, 416, 142.0, 205.5999999999998, 416.0, 416.0, 0.0998349786529325, 0.026908646590048213, 0.05869204799713415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e609af85-ed4f-4e67-917e-7e6e1d870bbe", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 727.8235294117648, 140, 1260, 1091.0, 1179.1999999999998, 1260.0, 1260.0, 0.0817665420929349, 14.151473721676311, 0.04401621472615423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 210.64705882352942, 139, 432, 146.0, 426.4, 432.0, 432.0, 0.09966757930901053, 0.026863527235631745, 0.05869096711263023], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 813.4615384615385, 147, 3679, 523.0, 2768.5999999999995, 3679.0, 3679.0, 0.08158910471647786, 0.016174402595161137, 0.05535703078419681], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2763f1ae-057e-4318-804f-fb41edafaef9", 3, 0, 0.0, 317.6666666666667, 248, 450, 255.0, 450.0, 450.0, 450.0, 0.024716786817713696, 0.024789199279093718, 0.015850283213182288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09fe1e5d-016d-4e36-85a4-5435402c0789", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7230a2c4-6b13-46b1-9278-3da8b1e1fc3b", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.1909768102536998, 0.7288088002114165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 454.16666666666674, 286, 852, 427.5, 770.4000000000003, 852.0, 852.0, 0.05685667852760155, 0.08811674689775749, 0.12787200258697887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29441822-c9b5-4e70-93da-38f08196e345", 1, 0, 0.0, 3679.0, 3679, 3679, 3679.0, 3679.0, 3679.0, 3679.0, 0.2718129926610492, 0.04910683949442784, 0.18740231720576245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 690.5217391304348, 166, 1705, 705.0, 1216.4000000000005, 1630.7999999999988, 1705.0, 0.10490642802734865, 0.06443959299726787, 0.0474332775162719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.1764705882353, 140, 150, 142.0, 148.4, 150.0, 150.0, 0.0818760204401077, 0.06084731597160347, 0.04109792432247593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9744c403-7491-4c78-afcb-6026e42a9e1e", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 192.00000000000003, 138, 435, 141.0, 429.4, 435.0, 435.0, 0.08187799215897816, 0.09424811620413628, 0.04265105887509271], "isController": false}, {"data": ["login", 23, 0, 0.0, 2968.2608695652175, 1730, 4571, 2938.0, 4349.400000000001, 4545.799999999999, 4571.0, 0.10380372971314064, 21.74232409498944, 0.18655317881997724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.88235294117646, 140, 156, 148.0, 153.6, 156.0, 156.0, 0.09347592994803838, 0.07567533781926154, 0.03322777197371676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10e96442-dcdd-4df2-84d5-2429f15dfe1d", 3, 0, 0.0, 940.0, 245, 2233, 342.0, 2233.0, 2233.0, 2233.0, 0.037221767289510904, 0.023930009894786473, 0.023869427591255366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ae096d1-ff03-453f-b8e3-8d98d4476856", 3, 0, 0.0, 876.6666666666666, 248, 1838, 544.0, 1838.0, 1838.0, 1838.0, 0.04642525533890436, 0.029846965916125037, 0.02977140397709687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02f13617-9af5-44c0-8da9-f524f1be4d1f", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.5109375, 0.9546875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a89b1b8-98ea-4a8c-8d9d-9e598fbe142d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1192.4705882352941, 286, 1881, 1663.0, 1871.4, 1881.0, 1881.0, 0.08170955617291664, 57.55392924583281, 0.17146896809241832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b63d0db-a069-43f8-9773-bfcfa1c5a892", 3, 0, 0.0, 384.6666666666667, 249, 589, 316.0, 589.0, 589.0, 589.0, 0.04209226624761477, 0.027061271431978895, 0.026992761884049834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 877.25, 144, 2058, 726.0, 2058.0, 2058.0, 2058.0, 0.05179938099739708, 30.991964216340115, 0.07556184117662293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 631.5714285714286, 280, 1714, 572.0, 1695.5, 1714.0, 1714.0, 0.14055378190068873, 24.20831043059655, 0.3109713207537699], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1332.8695652173913, 323, 2266, 1193.0, 2051.6, 2227.1999999999994, 2266.0, 0.10429467326292687, 0.033176617360982, 0.047054823288547085], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 157.0, 143, 235, 150.0, 191.8, 235.0, 235.0, 0.06767639853277567, 0.05254173518902018, 0.024056844790947603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 404.4705882352941, 281, 837, 294.0, 634.5999999999998, 837.0, 837.0, 0.09958233995067746, 0.15433317724777845, 0.2239630165101662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 400.1875, 285, 582, 297.5, 577.1, 582.0, 582.0, 0.08691306520652718, 0.13469827586206895, 0.19546952067444537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 143.11111111111114, 139, 148, 143.0, 148.0, 148.0, 148.0, 0.04853295657378896, 0.03606794917251309, 0.024361269217702666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 142.1111111111111, 139, 146, 142.0, 146.0, 146.0, 146.0, 0.04853164802691889, 0.012986007382202906, 0.02767820551535218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 142.44444444444446, 137, 154, 141.0, 154.0, 154.0, 154.0, 0.04853374173578231, 0.013081360077222576, 0.028532531762637647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c173f059-9547-4bf5-8e44-8e70846c7c1e", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.46618385036496346, 0.8710652372262773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 143.22222222222223, 138, 150, 144.0, 150.0, 150.0, 150.0, 0.04853243314657334, 0.013081007371537345, 0.028579157409554416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 153.5, 147, 160, 153.5, 160.0, 160.0, 160.0, 0.4012841091492777, 0.11834746187800962, 0.24805941512841093], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1641.1132075471696, 1103, 2784, 1584.0, 2284.6, 2430.5, 2784.0, 0.23976367444616853, 286.84070997756174, 0.47343959934585234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1332.8695652173913, 323, 2266, 1193.0, 2051.6, 2227.1999999999994, 2266.0, 0.10431643255942635, 0.03318353909371698, 0.04706464047114743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 141.125, 138, 146, 141.0, 146.0, 146.0, 146.0, 0.05596440663737862, 0.015084156476480957, 0.032955602736659484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 140.5, 138, 143, 140.5, 143.0, 143.0, 143.0, 0.0559640151382661, 0.015084050955235783, 0.03290071983714472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 450.2, 139, 1591, 143.0, 1533.4, 1591.0, 1591.0, 0.06876475577050908, 12.389757024033283, 0.03924426100809132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 366.4666666666667, 139, 1104, 145.0, 1099.2, 1104.0, 1104.0, 0.06876507101139667, 4.058670286956642, 0.03931159430671056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 144.93333333333334, 139, 149, 146.0, 148.4, 149.0, 149.0, 0.06876349483586154, 0.05110255817391663, 0.03451605111878206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 177.625, 138, 427, 142.0, 427.0, 427.0, 427.0, 0.05596440663737862, 0.014974850994767327, 0.031917200660379993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 179.66666666666666, 138, 439, 143.0, 427.0, 439.0, 439.0, 0.06876444053251184, 0.039056053333700075, 0.03806219227912862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 142.25, 140, 145, 142.0, 145.0, 145.0, 145.0, 0.0559612747978399, 0.04158840832144157, 0.028089936763759482], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 812.3076923076923, 145, 2233, 544.0, 2166.2, 2233.0, 2233.0, 0.0826682776382309, 0.016040577008680168, 0.05625690558328829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 187.875, 144, 455, 150.5, 455.0, 455.0, 455.0, 0.05351170568561873, 0.042119565217391304, 0.019021739130434784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/523e1df1-e26c-402f-825a-9418a498566b", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.3696017795138889, 0.6906014901620371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1513.4347826086955, 994, 2728, 1453.0, 2115.600000000001, 2641.9999999999986, 2728.0, 0.10421150404385945, 0.05393759486645069, 0.04793322109829863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 321.5, 279, 568, 287.5, 568.0, 568.0, 568.0, 0.0559069149865474, 0.08664479890981516, 0.1257359621230651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33eea7f5-6e33-4734-a84c-1de44257aeb7", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2763f1ae-057e-4318-804f-fb41edafaef9", 1, 0, 0.0, 1403.0, 1403, 1403, 1403.0, 1403.0, 1403.0, 1403.0, 0.7127583749109052, 0.1287698235923022, 0.4914134889522452], "isController": false}, {"data": ["addBook", 55, 12, 21.818181818181817, 1399.2, 714, 3907, 1115.0, 2448.0, 2698.6, 3907.0, 0.26848258524322083, 88.65328334370653, 0.9741360504991335], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 251.67924528301896, 138, 799, 146.0, 576.2, 623.3999999999999, 799.0, 0.2411239103928955, 0.17919462481347018, 0.11655892152781569], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 930.8867924528305, 682, 1305, 859.0, 1165.0, 1273.1999999999998, 1305.0, 0.2411074565892848, 70.89359775826931, 0.12126009779636884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94c28c46-7d67-47cc-8d61-0b37d6e9fb05", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.47804781062874246, 0.8932330651197604], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 211.22641509433964, 138, 574, 147.0, 428.6, 435.0, 574.0, 0.24187549344882509, 0.42800624426686623, 0.11763085521241688], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1387.943396226415, 962, 1951, 1379.0, 1707.0, 1850.3, 1951.0, 0.24067060821549555, 216.5558363261064, 0.12080536388941868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 189.25, 141, 439, 150.0, 424.3, 439.0, 439.0, 0.085672367448784, 0.06400328232257788, 0.030453849366559933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eef9425b-6892-41e8-a369-8f798510acce", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, 7.361963190184049, 210.70552147239266, 140, 1904, 151.0, 351.79999999999995, 427.59999999999997, 1057.9199999999805, 0.65874289224502, 1.442685295434063, 0.3154516190223124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 243.11111111111114, 144, 438, 148.0, 438.0, 438.0, 438.0, 0.049266476899496384, 0.0381526525208014, 0.017512692960367855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7230a2c4-6b13-46b1-9278-3da8b1e1fc3b", 3, 0, 0.0, 362.3333333333333, 239, 501, 347.0, 501.0, 501.0, 501.0, 0.024608317611352636, 0.024680412291854647, 0.015780724509884343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e609af85-ed4f-4e67-917e-7e6e1d870bbe", 3, 0, 0.0, 1034.0, 480, 2066, 556.0, 2066.0, 2066.0, 2066.0, 0.016423327694657493, 0.022640883068644035, 0.010531886575024497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 191.78571428571433, 142, 457, 150.0, 445.0, 457.0, 457.0, 0.13607690288969024, 0.1104295959973951, 0.04837108657406958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ae096d1-ff03-453f-b8e3-8d98d4476856", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09fe1e5d-016d-4e36-85a4-5435402c0789", 3, 0, 0.0, 422.0, 397, 444, 425.0, 444.0, 444.0, 444.0, 0.04050168081975402, 0.02603867826139785, 0.025972757556938612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85dcdb3-fdcf-42c8-83d7-d3be6ae63554", 3, 0, 0.0, 999.3333333333334, 263, 2095, 640.0, 2095.0, 2095.0, 2095.0, 0.08007473642065928, 0.036231732950754034, 0.05135001000934205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 289.33333333333326, 282, 300, 290.0, 300.0, 300.0, 300.0, 0.048494776034959344, 0.07515743121824266, 0.1090658878989369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de588f76-b5e0-4bae-aac6-6692d69b553f", 2, 0, 0.0, 228.0, 222, 234, 228.0, 234.0, 234.0, 234.0, 0.016372105207148064, 0.027691881073027773, 0.010176606410497793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 618.0666666666667, 281, 1737, 293.0, 1680.0, 1737.0, 1737.0, 0.06871907641561298, 16.527582119296316, 0.15103432947361187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29441822-c9b5-4e70-93da-38f08196e345", 3, 0, 0.0, 781.6666666666667, 313, 1644, 388.0, 1644.0, 1644.0, 1644.0, 0.03857578212398256, 0.024448908787563166, 0.024737724864663295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 149.58333333333334, 143, 168, 147.5, 164.4, 168.0, 168.0, 0.056366078893721756, 0.04673320408278298, 0.020036379606752655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 162.41176470588238, 141, 414, 145.0, 212.3999999999998, 414.0, 414.0, 0.08129692506336378, 0.06311626506384199, 0.02889851633111759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed64b46-9d93-480e-83af-8c2df62e5427", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b63d0db-a069-43f8-9773-bfcfa1c5a892", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 149.625, 137, 234, 145.5, 174.50000000000006, 234.0, 234.0, 0.08698252194949578, 0.0646422843784827, 0.043661148712930496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 177.0, 138, 416, 143.5, 414.6, 416.0, 416.0, 0.08698252194949578, 0.023274620131017425, 0.04960721954932181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 230.37499999999994, 139, 437, 145.0, 434.9, 437.0, 437.0, 0.08698583218258327, 0.023445400080461896, 0.051138155247963994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a89b1b8-98ea-4a8c-8d9d-9e598fbe142d", 3, 0, 0.0, 404.6666666666667, 231, 652, 331.0, 652.0, 652.0, 652.0, 0.032187459765675296, 0.03228175896420755, 0.020641046789837348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 213.31250000000003, 138, 438, 144.5, 426.1, 438.0, 438.0, 0.08698630509359183, 0.02344552754475717, 0.05122338083148034], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 16.666666666666668, 0.32336297493936944], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.16168148746968472], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.16168148746968472], "isController": false}, {"data": ["401/Unauthorized", 16, 66.66666666666667, 1.2934518997574778], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1237, 24, "401/Unauthorized", 16, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

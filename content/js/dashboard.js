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

    var data = {"OkPercent": 97.40163325909428, "KoPercent": 2.5983667409057163};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.75493316359007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f687cbf1-3dc0-4eb0-aab8-dadde653c056"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc141284-608e-470f-9b46-7157033cdaec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b3cfccd-daf2-4b4e-8e28-ee11a6149d2a"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/09940337-0647-40c5-b8d7-964a9b485a8e"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b10e3178-6f1d-4974-8758-376572978672"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69e19c55-8555-4dad-8d4a-374fdb465c32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55e56729-a26a-4017-aeb4-c3016d85a489"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcf9b0db-7fa0-42fb-a5c0-c38005227973"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce8c0db0-c15d-4405-b25d-cc232ea2f84d"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8308ca00-3c15-4fc2-8bba-3c19e5faafd8"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce8c0db0-c15d-4405-b25d-cc232ea2f84d"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09940337-0647-40c5-b8d7-964a9b485a8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69e19c55-8555-4dad-8d4a-374fdb465c32"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f5ec664a-3028-48de-a53a-69e137dd4559"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe65965c-a907-4813-9b95-5d94f4df175a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09bd9a27-745d-4cf0-ae4a-a1618c768ddd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d65f547b-49fb-45b5-a8aa-0f6d235bda1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc141284-608e-470f-9b46-7157033cdaec"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b3cfccd-daf2-4b4e-8e28-ee11a6149d2a"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9a851f4-cabb-4f90-9274-691fce32432b"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f687cbf1-3dc0-4eb0-aab8-dadde653c056"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b26c44d-d3ec-40a8-9a39-b56c35dff972"], "isController": false}, {"data": [0.903954802259887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcf9b0db-7fa0-42fb-a5c0-c38005227973"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b26c44d-d3ec-40a8-9a39-b56c35dff972"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8308ca00-3c15-4fc2-8bba-3c19e5faafd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d65f547b-49fb-45b5-a8aa-0f6d235bda1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a096883-27fc-4f60-bb7f-e25e7b6d7130"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09bd9a27-745d-4cf0-ae4a-a1618c768ddd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe65965c-a907-4813-9b95-5d94f4df175a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 35, 2.5983667409057163, 417.34595397178975, 137, 2287, 154.0, 1111.2, 1276.3999999999996, 1667.2399999999998, 5.3634354655677, 756.100493334279, 3.917580916900595], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f687cbf1-3dc0-4eb0-aab8-dadde653c056", 3, 0, 0.0, 296.0, 224, 428, 236.0, 428.0, 428.0, 428.0, 0.02476330408511973, 0.024835852827556605, 0.015880113622293576], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2056.9999999999995, 1693, 2868, 2014.0, 2433.2, 2521.699999999999, 2868.0, 0.2461565037139402, 296.2101817563482, 1.2103496056637588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fc141284-608e-470f-9b46-7157033cdaec", 3, 0, 0.0, 768.3333333333334, 219, 1809, 277.0, 1809.0, 1809.0, 1809.0, 0.07693688610776293, 0.034060600620624215, 0.04933778178134537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b3cfccd-daf2-4b4e-8e28-ee11a6149d2a", 3, 0, 0.0, 349.0, 255, 453, 339.0, 453.0, 453.0, 453.0, 0.049477191014942114, 0.03180906648909852, 0.031728537206847644], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 470.9333333333333, 145, 1147, 467.0, 828.4000000000002, 1147.0, 1147.0, 0.09540649527419827, 0.019416712514788007, 0.06393353228237778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 470.9333333333333, 145, 1147, 467.0, 828.4000000000002, 1147.0, 1147.0, 0.09317754048564134, 0.0189630853878981, 0.062439871368405356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 174.21052631578948, 138, 442, 143.0, 429.0, 442.0, 442.0, 0.09398031359746749, 0.0400053945936588, 0.05276731834594649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 174.6842105263158, 140, 435, 145.0, 411.0, 435.0, 435.0, 0.09397891904458064, 0.06984175526652917, 0.04717301209854926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 278.5263157894736, 140, 1023, 144.0, 688.0, 1023.0, 1023.0, 0.09398124332238535, 2.9314651057536305, 0.05449231115953069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 321.0526315789474, 138, 1278, 145.0, 1233.0, 1278.0, 1278.0, 0.09398031359746749, 8.924101235964782, 0.05439999443537617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09940337-0647-40c5-b8d7-964a9b485a8e", 2, 0, 0.0, 682.0, 401, 963, 682.0, 963.0, 963.0, 963.0, 0.01672800267648043, 0.02858789519906323, 0.01039782588240214], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 231.53333333333336, 142, 401, 235.0, 321.20000000000005, 401.0, 401.0, 0.09557305604404007, 0.14820668111412696, 0.06176782079096261], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b10e3178-6f1d-4974-8758-376572978672", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.6438224546370968, 1.2029832409274193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69e19c55-8555-4dad-8d4a-374fdb465c32", 3, 0, 0.0, 352.0, 236, 518, 302.0, 518.0, 518.0, 518.0, 0.02142581668071248, 0.025324589963433272, 0.013739862910482938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55e56729-a26a-4017-aeb4-c3016d85a489", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 159.35, 139, 429, 145.0, 153.70000000000002, 415.24999999999983, 429.0, 0.10845104790825041, 0.08059692134587751, 0.05443734240707101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 886.7142857142857, 709, 1027, 991.0, 1027.0, 1027.0, 1027.0, 0.0349987750428735, 10.290801931307405, 0.019960238891638792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 172.19999999999996, 137, 445, 144.0, 402.80000000000064, 444.3, 445.0, 0.10844751953410946, 0.045306493024113305, 0.06093818626945956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1160.4285714285713, 971, 1329, 1240.0, 1329.0, 1329.0, 1329.0, 0.03489705369160975, 31.400430254187647, 0.019868146779500474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcf9b0db-7fa0-42fb-a5c0-c38005227973", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 264.57142857142856, 141, 432, 149.0, 432.0, 432.0, 432.0, 0.035053983134026405, 0.06202911859263265, 0.019409773864250947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 164.06666666666663, 139, 426, 146.0, 264.0000000000001, 426.0, 426.0, 0.07251841967859836, 0.05389308337442711, 0.03640084737773395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 217.86666666666667, 137, 442, 143.0, 435.4, 442.0, 442.0, 0.07242318314374553, 0.019378859552135034, 0.04130384663666737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 259.4, 138, 442, 145.0, 441.4, 442.0, 442.0, 0.0724133935812768, 0.01951767248870351, 0.0425711552108678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 200.93333333333337, 137, 446, 144.0, 434.6, 446.0, 446.0, 0.07251947147809187, 0.019546263796829447, 0.04270433720829042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 144.42857142857142, 139, 150, 144.0, 150.0, 150.0, 150.0, 0.03510513989398248, 0.026088878378242836, 0.019712358827187425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 617.0588235294117, 137, 1445, 150.0, 1311.3999999999999, 1445.0, 1445.0, 0.09731691539725337, 41.22138363902294, 0.05327609166680978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 287.35, 138, 1289, 146.0, 1201.6000000000017, 1288.9, 1289.0, 0.10844810758052273, 9.784486921836027, 0.06282364982106063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce8c0db0-c15d-4405-b25d-cc232ea2f84d", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 549.0, 138, 1192, 150.0, 1188.0, 1192.0, 1192.0, 0.09731580122388932, 13.479334166719141, 0.05337051667534876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 216.4, 138, 1036, 146.0, 635.1000000000012, 1018.6499999999997, 1036.0, 0.10844928369248122, 3.2150764499669227, 0.06293023864264877], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 401.80000000000007, 148, 865, 431.0, 794.2, 865.0, 865.0, 0.09323487730290146, 0.018974754326098308, 0.06295175211643173], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8308ca00-3c15-4fc2-8bba-3c19e5faafd8", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 465.40000000000003, 286, 854, 568.0, 700.4000000000001, 854.0, 854.0, 0.07236413633403285, 0.11215027769737318, 0.16274863864968522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 535.5, 174, 1323, 487.5, 1157.5, 1294.5, 1323.0, 0.10187146368070088, 0.06257534243668052, 0.046061023129066896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.05882352941177, 138, 149, 144.0, 147.4, 149.0, 149.0, 0.0973119018180153, 0.07231870828467739, 0.04884601321724596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 240.05882352941174, 138, 441, 144.0, 428.2, 441.0, 441.0, 0.09731580122388932, 0.09482253104087837, 0.05165429706506992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce8c0db0-c15d-4405-b25d-cc232ea2f84d", 3, 0, 0.0, 327.6666666666667, 233, 444, 306.0, 444.0, 444.0, 444.0, 0.057114571831093176, 0.03552927954727182, 0.03662620654532993], "isController": false}, {"data": ["login", 24, 0, 0.0, 2263.7083333333335, 1460, 3473, 2151.0, 3181.5, 3413.75, 3473.0, 0.10518058191156943, 36.84399689361203, 0.20956511937996047], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 167.75, 147, 448, 151.5, 162.9, 433.7499999999998, 448.0, 0.1072069898957412, 0.08679159631207954, 0.03810873468950175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09940337-0647-40c5-b8d7-964a9b485a8e", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69e19c55-8555-4dad-8d4a-374fdb465c32", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 794.7647058823528, 283, 1584, 294.0, 1451.1999999999998, 1584.0, 1584.0, 0.09723231086885649, 54.82031750460423, 0.20697054683165655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5ec664a-3028-48de-a53a-69e137dd4559", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.6261488970588235, 1.1699601715686274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe65965c-a907-4813-9b95-5d94f4df175a", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09bd9a27-745d-4cf0-ae4a-a1618c768ddd", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d65f547b-49fb-45b5-a8aa-0f6d235bda1f", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc141284-608e-470f-9b46-7157033cdaec", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.5790514823717948, 2.209785657051282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 544.2105263157895, 287, 1690, 299.0, 1374.0, 1690.0, 1690.0, 0.09391249332727021, 11.956750786826055, 0.20868209416210284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 772.0769230769231, 142, 1473, 1134.0, 1459.8, 1473.0, 1473.0, 0.06407697122943992, 41.28547800188288, 0.09739584103489238], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 941.7916666666666, 167, 1597, 1055.0, 1341.0, 1534.25, 1597.0, 0.10175441571766541, 0.031947309231669364, 0.045908730528868576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 166.8125, 143, 431, 149.0, 241.30000000000018, 431.0, 431.0, 0.0873739221607571, 0.0678342462087909, 0.03105869889308162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 464.15, 284, 1717, 298.0, 1343.7000000000019, 1702.6, 1717.0, 0.1083652559316432, 13.115402478719773, 0.24094337373551292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b3cfccd-daf2-4b4e-8e28-ee11a6149d2a", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 518.9333333333333, 287, 1385, 299.0, 1239.8000000000002, 1385.0, 1385.0, 0.07068703081483296, 11.37044609848824, 0.15656533042652554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 186.42857142857142, 144, 428, 146.0, 428.0, 428.0, 428.0, 0.041298909708783686, 0.030691865516000377, 0.020730116787416812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 186.71428571428572, 140, 443, 145.0, 443.0, 443.0, 443.0, 0.04129939702880338, 0.01105081522059778, 0.023553562367989427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 224.14285714285714, 142, 428, 148.0, 428.0, 428.0, 428.0, 0.04129964069312597, 0.01113154378056911, 0.02427967157935726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 184.14285714285714, 141, 426, 144.0, 426.0, 426.0, 426.0, 0.04129939702880338, 0.011131478105419661, 0.024319859773797303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 152.33333333333334, 148, 159, 150.0, 159.0, 159.0, 159.0, 0.024317686253211963, 0.007171817625458996, 0.015032319724885909], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1352.122807017544, 1095, 2287, 1175.0, 1820.0, 1888.4999999999989, 2287.0, 0.24959058386681499, 298.5971100311331, 0.49284390681513657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 941.7916666666666, 167, 1597, 1055.0, 1341.0, 1534.25, 1597.0, 0.10563984735042058, 0.033167198167148644, 0.047661728003803035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 216.5, 139, 442, 147.0, 442.0, 442.0, 442.0, 0.035999874000440996, 0.009703091039181362, 0.021199144552994063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 177.25, 137, 413, 146.5, 413.0, 413.0, 413.0, 0.03604675263817171, 0.009715726297007218, 0.021191547937675165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 270.31250000000006, 138, 1317, 146.0, 703.8000000000006, 1317.0, 1317.0, 0.08444029279671526, 4.770057084606535, 0.049188119778555334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 247.06249999999997, 137, 962, 146.5, 588.2000000000004, 962.0, 962.0, 0.0845987902372996, 1.5760552211993994, 0.04936306363943996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 199.25, 137, 597, 142.5, 597.0, 597.0, 597.0, 0.03604675263817171, 0.009645322483260789, 0.020557913613957302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 179.375, 138, 416, 148.5, 415.3, 416.0, 416.0, 0.08496763264244027, 0.06314489105556352, 0.042649768728724904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 147.0, 140, 152, 149.5, 152.0, 152.0, 152.0, 0.03604431648712092, 0.026786840670604505, 0.018092557299199365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 212.625, 137, 427, 142.5, 427.0, 427.0, 427.0, 0.08496853508934973, 0.030711893603462468, 0.04801261583601073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 157.625, 151, 198, 151.0, 198.0, 198.0, 198.0, 0.037021782691391045, 0.029140192235606627, 0.013160086816080411], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 513.4285714285716, 143, 1809, 453.0, 1219.5, 1809.0, 1809.0, 0.10164003455761175, 0.020255690480684763, 0.06916144929614275], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b9a851f4-cabb-4f90-9274-691fce32432b", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1094.2500000000002, 835, 1636, 1049.5, 1439.5, 1596.5, 1636.0, 0.1027876877481359, 0.05320065869776565, 0.047278321220089854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 423.50000000000006, 290, 748, 301.0, 748.0, 748.0, 748.0, 0.03597510522718279, 0.05575438671439364, 0.08090885482246285], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 1261.1499999999999, 728, 2348, 1071.5, 2028.8, 2272.0499999999997, 2348.0, 0.2800911229786757, 84.88705799578463, 1.0173407404792358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f687cbf1-3dc0-4eb0-aab8-dadde653c056", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 261.42105263157896, 140, 827, 149.0, 578.8000000000001, 593.5, 827.0, 0.25068719076415613, 0.18630171110500274, 0.1211817963166575], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 823.9824561403508, 681, 1226, 720.0, 1058.4, 1180.7, 1226.0, 0.25086813578567935, 73.76356152706074, 0.12616903313439928], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 226.6666666666667, 138, 562, 148.0, 431.0, 441.5, 562.0, 0.2514668901927913, 0.4449785205364627, 0.12229542120704108], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1084.105263157895, 954, 1515, 1002.0, 1328.6, 1434.3999999999996, 1515.0, 0.2505307295718562, 225.42799085480425, 0.1257546826171231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 148.86666666666665, 140, 164, 148.0, 156.8, 164.0, 164.0, 0.07342970574269252, 0.05485715321597635, 0.026101965713222732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b26c44d-d3ec-40a8-9a39-b56c35dff972", 3, 0, 0.0, 360.3333333333333, 235, 500, 346.0, 500.0, 500.0, 500.0, 0.09171507184347294, 0.041498681595842246, 0.05881467823295628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 16, 9.03954802259887, 195.1016949152544, 138, 1074, 151.0, 305.6, 362.0999999999998, 757.3199999999995, 0.7204112449276129, 1.5747032055756573, 0.34497844489871504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 149.0, 145, 151, 150.0, 151.0, 151.0, 151.0, 0.04209386932860278, 0.03259808435310743, 0.014963055112901772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcf9b0db-7fa0-42fb-a5c0-c38005227973", 3, 0, 0.0, 326.6666666666667, 224, 514, 242.0, 514.0, 514.0, 514.0, 0.04508634034175446, 0.028986172582996437, 0.028912789867596447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b26c44d-d3ec-40a8-9a39-b56c35dff972", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8308ca00-3c15-4fc2-8bba-3c19e5faafd8", 3, 0, 0.0, 321.6666666666667, 244, 453, 268.0, 453.0, 453.0, 453.0, 0.06924088905301545, 0.03132969914833707, 0.04440252325339857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 164.47368421052633, 142, 438, 151.0, 156.0, 438.0, 438.0, 0.09132156727035029, 0.07410959218912215, 0.032461963365632326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d65f547b-49fb-45b5-a8aa-0f6d235bda1f", 3, 0, 0.0, 395.0, 247, 630, 308.0, 630.0, 630.0, 630.0, 0.02028685614590307, 0.027967068938118327, 0.013009474807105811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a096883-27fc-4f60-bb7f-e25e7b6d7130", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 415.7142857142857, 288, 855, 295.0, 855.0, 855.0, 855.0, 0.04126409610997471, 0.06395128957668932, 0.0928039192785857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09bd9a27-745d-4cf0-ae4a-a1618c768ddd", 3, 0, 0.0, 447.3333333333333, 230, 597, 515.0, 597.0, 597.0, 597.0, 0.03352629579133234, 0.027949493333854852, 0.021499610256811425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 522.2500000000001, 284, 1459, 433.0, 1028.5000000000005, 1459.0, 1459.0, 0.08437750495717841, 6.43164750539225, 0.1884176877663165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe65965c-a907-4813-9b95-5d94f4df175a", 3, 0, 0.0, 301.0, 248, 405, 250.0, 405.0, 405.0, 405.0, 0.05354943505346019, 0.03393904623993717, 0.034339969744569196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 168.8666666666667, 146, 435, 151.0, 267.6000000000001, 435.0, 435.0, 0.07272762534606228, 0.06029858781133485, 0.02585239807223308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 149.52941176470588, 141, 154, 150.0, 154.0, 154.0, 154.0, 0.09492380968334534, 0.07369573115064408, 0.03374244797337666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 145.66666666666669, 139, 150, 145.0, 149.4, 150.0, 150.0, 0.07083457293835975, 0.052641708990324, 0.035555635244450115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 239.33333333333331, 139, 440, 146.0, 437.0, 440.0, 440.0, 0.07073736630637768, 0.03309366629411654, 0.03955029308848773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 330.53333333333336, 140, 1235, 147.0, 1092.2, 1235.0, 1235.0, 0.07083223149862114, 8.514541488208794, 0.04082998552661403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 294.5333333333333, 139, 731, 148.0, 706.4, 731.0, 731.0, 0.0707343641688005, 2.78962332772174, 0.04084264816491481], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.0, 0.5196733481811433], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.22271714922049], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.22271714922049], "isController": false}, {"data": ["401/Unauthorized", 22, 62.857142857142854, 1.6332590942835932], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 35, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

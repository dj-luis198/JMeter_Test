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

    var data = {"OkPercent": 99.2671009771987, "KoPercent": 0.7328990228013029};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7264480111653873, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2da82bd1-ed4f-44c1-957e-4e38628e8b1e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7887080-f25e-44ed-b31b-360915aeca73"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45c306f8-6128-40ba-b8dc-32c985db3d70"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b039f0f-c3bb-409c-b9dd-bcd75e67e9fa"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b31d949c-d0ff-40a5-9dee-17ae61a497ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b34144a-2bd0-4a2b-aa26-bab84b507013"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40b0ce7d-c168-44be-8791-afd0a9701a0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a05e44e6-8e59-4107-8f49-2cbbaaf5f743"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7c2e4b2-50ff-46e0-9a8f-bd5e5d3c30c2"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cca5e845-ef87-4a06-9fa7-e7e10433c9b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1ba5b24-75c9-473c-8115-7db96e7acb67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a3503d2-f9ac-4bce-a10d-1463cb3144b4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e74c35f-f070-4a83-a10b-96d8526b883d"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97af4ac0-419f-45cb-9d11-f0bf9f0aa2d1"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e614134-ba2a-42b6-ac0e-84afff55be08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc14afd4-5db9-45d6-8103-2c4c30f6063f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2da82bd1-ed4f-44c1-957e-4e38628e8b1e"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5e1a3eb-feea-4695-9f8c-1e4ca45388e1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2641509433962264, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b31d949c-d0ff-40a5-9dee-17ae61a497ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40b0ce7d-c168-44be-8791-afd0a9701a0c"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48549f5d-9261-4265-84ae-8f55543c4705"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cca5e845-ef87-4a06-9fa7-e7e10433c9b0"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7887080-f25e-44ed-b31b-360915aeca73"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3867924528301887, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b7c2e4b2-50ff-46e0-9a8f-bd5e5d3c30c2"], "isController": false}, {"data": [0.9161490683229814, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b34144a-2bd0-4a2b-aa26-bab84b507013"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e74c35f-f070-4a83-a10b-96d8526b883d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a3503d2-f9ac-4bce-a10d-1463cb3144b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31954851-1b9b-4fab-b3cb-8357a936c7f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2e614134-ba2a-42b6-ac0e-84afff55be08"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5e1a3eb-feea-4695-9f8c-1e4ca45388e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a05e44e6-8e59-4107-8f49-2cbbaaf5f743"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc14afd4-5db9-45d6-8103-2c4c30f6063f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1228, 9, 0.7328990228013029, 517.8379478827369, 124, 7305, 155.0, 1393.3000000000004, 1647.3999999999996, 3030.230000000004, 4.818274916327596, 688.4580055019755, 3.5054640569148914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/2da82bd1-ed4f-44c1-957e-4e38628e8b1e", 3, 0, 0.0, 491.6666666666667, 238, 705, 532.0, 705.0, 705.0, 705.0, 0.030433062479077268, 0.03052222184180894, 0.019515993842377025], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2199.867924528302, 1560, 3855, 2130.0, 2654.0, 2854.5999999999995, 3855.0, 0.2463386179938741, 296.42749906606286, 1.2112450601554257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7887080-f25e-44ed-b31b-360915aeca73", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 884.6923076923076, 494, 1670, 706.0, 1611.6, 1670.0, 1670.0, 0.08357065255822625, 0.015098213596945173, 0.0568019279106694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 884.6923076923076, 494, 1670, 706.0, 1611.6, 1670.0, 1670.0, 0.08527777595560308, 0.01540662944510407, 0.05796223834482396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 166.86666666666665, 127, 395, 133.0, 389.0, 395.0, 395.0, 0.12813941568426448, 0.05994855736374509, 0.07164461600888433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 150.26666666666665, 127, 382, 133.0, 239.2000000000001, 382.0, 382.0, 0.12813065910411042, 0.09522210115061332, 0.06431558474561794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c306f8-6128-40ba-b8dc-32c985db3d70", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 310.2, 127, 1122, 139.0, 1056.0, 1122.0, 1122.0, 0.12784672030546843, 5.042021618880404, 0.07381982828054684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 306.86666666666673, 126, 1468, 130.0, 1292.2, 1468.0, 1468.0, 0.12784780996701528, 15.368222334799322, 0.07369560608385112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b039f0f-c3bb-409c-b9dd-bcd75e67e9fa", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 427.61538461538464, 238, 979, 355.0, 894.5999999999999, 979.0, 979.0, 0.08363409440359242, 0.17132047177670984, 0.05406813524919744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b31d949c-d0ff-40a5-9dee-17ae61a497ce", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 148.64705882352942, 127, 394, 133.0, 194.79999999999984, 394.0, 394.0, 0.08451698542827739, 0.06280998624113193, 0.042423564951303304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b34144a-2bd0-4a2b-aa26-bab84b507013", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 147.0, 127, 392, 132.0, 191.19999999999982, 392.0, 392.0, 0.08451572489634394, 0.0375485188619212, 0.047365315492229526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 948.25, 761, 1054, 989.0, 1054.0, 1054.0, 1054.0, 0.0728862973760933, 21.430991481413994, 0.04156796647230321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1358.0, 1207, 1509, 1358.0, 1509.0, 1509.0, 1509.0, 0.07212275292547916, 64.89617986062278, 0.04106207515190855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 192.25, 127, 379, 131.5, 379.0, 379.0, 379.0, 0.07395902669920865, 0.13087280896383402, 0.040951922010206344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 135.33333333333331, 129, 151, 135.0, 151.0, 151.0, 151.0, 0.07357690012344568, 0.05467970800189665, 0.036932154944776446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40b0ce7d-c168-44be-8791-afd0a9701a0c", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 159.22222222222223, 126, 390, 132.0, 390.0, 390.0, 390.0, 0.07357509564762434, 0.019687086140086983, 0.04196079673653576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 160.33333333333334, 127, 389, 132.0, 389.0, 389.0, 389.0, 0.07357509564762434, 0.019830787498773747, 0.04325410896471665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 130.66666666666666, 127, 135, 130.0, 135.0, 135.0, 135.0, 0.07357690012344568, 0.01983127386139747, 0.043327022240661865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 134.0, 128, 144, 132.0, 144.0, 144.0, 144.0, 0.0739658647534163, 0.05496877253647442, 0.04153356663399841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1195.9166666666667, 142, 1694, 1356.5, 1647.2000000000003, 1694.0, 1694.0, 0.07745333436604446, 58.08068469150983, 0.03998730088038624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 315.1176470588235, 127, 1425, 139.0, 1395.3999999999999, 1425.0, 1425.0, 0.08451572489634394, 8.966852357864438, 0.04883152349537152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 816.0833333333335, 131, 1078, 938.5, 1069.3, 1078.0, 1078.0, 0.07757801439072166, 19.012245002682906, 0.040127429969679926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 254.2941176470588, 127, 1078, 131.0, 1022.0, 1078.0, 1078.0, 0.08451740561394437, 2.9437381302761234, 0.048915031109862686], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 618.4615384615386, 281, 1456, 546.0, 1171.5999999999997, 1456.0, 1456.0, 0.08546221912512984, 0.015439951697411152, 0.05892219404525553], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 298.77777777777777, 260, 526, 268.0, 526.0, 526.0, 526.0, 0.0734963864276673, 0.11390504419991017, 0.16529509564738068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a05e44e6-8e59-4107-8f49-2cbbaaf5f743", 3, 0, 0.0, 587.6666666666666, 330, 944, 489.0, 944.0, 944.0, 944.0, 0.023583978617192723, 0.023653072304547777, 0.015123840454384654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7c2e4b2-50ff-46e0-9a8f-bd5e5d3c30c2", 1, 0, 0.0, 1456.0, 1456, 1456, 1456.0, 1456.0, 1456.0, 1456.0, 0.6868131868131868, 0.12408246050824176, 0.47352549793956045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 966.6521739130433, 182, 2950, 831.0, 1798.0, 2721.1999999999966, 2950.0, 0.09740479739802141, 0.05983165777671433, 0.04404142694851945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 134.33333333333334, 127, 141, 133.5, 140.7, 141.0, 141.0, 0.07757650983282262, 0.05765207420193165, 0.03893977153717854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 318.25000000000006, 131, 537, 381.5, 498.3000000000001, 537.0, 537.0, 0.0775785159229904, 0.1178577258504545, 0.03881451138464721], "isController": false}, {"data": ["login", 23, 0, 0.0, 4583.521739130434, 1866, 9390, 4228.0, 8153.000000000001, 9181.399999999998, 9390.0, 0.09897709325793862, 20.731355660736646, 0.17787888189235596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cca5e845-ef87-4a06-9fa7-e7e10433c9b0", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1ba5b24-75c9-473c-8115-7db96e7acb67", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 157.76470588235296, 132, 433, 140.0, 220.99999999999983, 433.0, 433.0, 0.08667852972818632, 0.07017236439908835, 0.03081150861431623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a3503d2-f9ac-4bce-a10d-1463cb3144b4", 3, 0, 0.0, 471.33333333333337, 290, 780, 344.0, 780.0, 780.0, 780.0, 0.031955347727442185, 0.02663985857095685, 0.020492198900736038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e74c35f-f070-4a83-a10b-96d8526b883d", 3, 0, 0.0, 808.3333333333334, 255, 1191, 979.0, 1191.0, 1191.0, 1191.0, 0.034200896063476864, 0.02779936115576228, 0.021932215249039527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1331.3333333333333, 283, 1827, 1494.0, 1782.0000000000002, 1827.0, 1827.0, 0.07738540511259577, 77.16986207260685, 0.1575417719968014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97af4ac0-419f-45cb-9d11-f0bf9f0aa2d1", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 513.4666666666667, 261, 1597, 273.0, 1430.8000000000002, 1597.0, 1597.0, 0.12769652495190095, 20.54077582821838, 0.28283616376228016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1492.75, 1351, 1642, 1489.0, 1642.0, 1642.0, 1642.0, 0.07195668207738941, 86.08520795481121, 0.16225388566083218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e614134-ba2a-42b6-ac0e-84afff55be08", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc14afd4-5db9-45d6-8103-2c4c30f6063f", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2da82bd1-ed4f-44c1-957e-4e38628e8b1e", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1951.0434782608693, 284, 4406, 1689.0, 4102.400000000001, 4382.4, 4406.0, 0.09815678626146407, 0.031224127151447387, 0.04428558130155899], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 191.86666666666667, 131, 395, 142.0, 387.8, 395.0, 395.0, 0.07834902925552753, 0.060827615486469123, 0.0278506314931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 495.82352941176475, 257, 1783, 281.0, 1601.3999999999999, 1783.0, 1783.0, 0.08446155757048814, 12.003191567817662, 0.18741363650478202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5e1a3eb-feea-4695-9f8c-1e4ca45388e1", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 419.22222222222223, 263, 791, 398.5, 656.9000000000002, 791.0, 791.0, 0.08780187993580707, 0.136075765095826, 0.1974684858321911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 134.64285714285717, 129, 150, 133.0, 145.5, 150.0, 150.0, 0.06769007615133567, 0.050304831983560984, 0.03397724525565091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 150.6428571428571, 128, 388, 132.0, 264.5, 388.0, 388.0, 0.06769007615133567, 0.018112383657681617, 0.038604496555058626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 132.50000000000003, 126, 141, 131.0, 140.5, 141.0, 141.0, 0.06769040343480447, 0.01824467905078714, 0.03979455358178934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 132.92857142857142, 127, 143, 131.0, 142.5, 143.0, 143.0, 0.06768843978146305, 0.01824414978484746, 0.03985950116037325], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1504.981132075472, 1006, 2274, 1440.0, 2086.2, 2145.4999999999995, 2274.0, 0.24221595609036026, 289.77449137505545, 0.47828189767061374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1951.0434782608693, 284, 4406, 1689.0, 4102.400000000001, 4382.4, 4406.0, 0.09914177705169597, 0.031537457272049346, 0.044729981443245644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 167.85714285714286, 124, 387, 133.0, 387.0, 387.0, 387.0, 0.041573127130622764, 0.011205256921925668, 0.024481050448989777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b31d949c-d0ff-40a5-9dee-17ae61a497ce", 3, 0, 0.0, 402.6666666666667, 283, 587, 338.0, 587.0, 587.0, 587.0, 0.04953846661932991, 0.03139693831635265, 0.031767831783880186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 129.71428571428572, 127, 133, 128.0, 133.0, 133.0, 133.0, 0.04157460860475613, 0.011205656225500677, 0.02444132263678046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40b0ce7d-c168-44be-8791-afd0a9701a0c", 3, 0, 0.0, 356.0, 274, 439, 355.0, 439.0, 439.0, 439.0, 0.034908887802834604, 0.028761196298494263, 0.022386233389187552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 306.93333333333334, 128, 1192, 133.0, 1078.6000000000001, 1192.0, 1192.0, 0.07791317355938542, 9.365721433784191, 0.04491166918585928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 300.7333333333334, 127, 1046, 133.0, 1023.2, 1046.0, 1046.0, 0.07797352019254261, 3.075121313801833, 0.04502260094971748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 174.42857142857144, 127, 434, 132.0, 434.0, 434.0, 434.0, 0.0415733740356462, 0.011124125474381892, 0.02370981487970447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 134.86666666666665, 128, 143, 134.0, 143.0, 143.0, 143.0, 0.07807254500882219, 0.058020709718470405, 0.03918875794388146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.42857142857142, 130, 139, 133.0, 139.0, 139.0, 139.0, 0.04157164576206765, 0.030894553149349108, 0.02086701750166287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 198.2, 128, 396, 132.0, 388.2, 396.0, 396.0, 0.07807498321387861, 0.03652648628743045, 0.043652861708384734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48549f5d-9261-4265-84ae-8f55543c4705", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 173.14285714285714, 127, 384, 140.0, 384.0, 384.0, 384.0, 0.04225445633605573, 0.033258878717637615, 0.015020138775707308], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 697.5384615384615, 439, 1191, 631.0, 1174.6, 1191.0, 1191.0, 0.08934646497274933, 0.016141695331990846, 0.060814927818365505], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 2886.7391304347825, 1251, 7305, 1830.0, 6404.8, 7147.599999999998, 7305.0, 0.09649229529998617, 0.04994230127831315, 0.04438268660770848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 310.57142857142856, 260, 568, 271.0, 568.0, 568.0, 568.0, 0.04153858934950569, 0.0643767004860015, 0.09342126100772617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cca5e845-ef87-4a06-9fa7-e7e10433c9b0", 3, 0, 0.0, 1284.6666666666667, 418, 2597, 839.0, 2597.0, 2597.0, 2597.0, 0.055835768393232704, 0.025264231141469227, 0.035806140538629044], "isController": false}, {"data": ["addBook", 54, 5, 9.25925925925926, 1566.1851851851857, 674, 5643, 1100.5, 2662.0, 4214.5, 5643.0, 0.2590027435105424, 92.82325580837635, 0.9392362401794794], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7887080-f25e-44ed-b31b-360915aeca73", 3, 0, 0.0, 456.0, 335, 559, 474.0, 559.0, 559.0, 559.0, 0.042965169569202565, 0.027622464159887717, 0.027552533870875345], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 230.05660377358498, 126, 669, 141.0, 531.2, 551.9999999999999, 669.0, 0.24366471734892786, 0.18108286123294348, 0.11778714364035088], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 867.8301886792453, 630, 1303, 814.0, 1151.0, 1262.7, 1303.0, 0.24356169923346999, 71.61522658418502, 0.12249440928245804], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 205.4150943396227, 126, 531, 139.0, 416.6, 454.09999999999974, 531.0, 0.24414962225907497, 0.4320303862631288, 0.1187368280127142], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1266.9056603773583, 879, 1758, 1291.0, 1564.0, 1609.0999999999997, 1758.0, 0.2428463424133428, 218.51356578186213, 0.12189748046919746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 168.5555555555556, 132, 388, 140.0, 378.1, 388.0, 388.0, 0.08433243847245843, 0.06300226116350655, 0.029977546488256707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7c2e4b2-50ff-46e0-9a8f-bd5e5d3c30c2", 3, 0, 0.0, 1077.0, 768, 1313, 1150.0, 1313.0, 1313.0, 1313.0, 0.040983606557377046, 0.02634851007513661, 0.026281804986338798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 5, 3.1055900621118013, 294.48447204968943, 129, 3718, 143.0, 462.60000000000025, 833.1000000000003, 3170.539999999996, 0.665292005338865, 1.4727349725618701, 0.3189377525836884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 224.57142857142858, 132, 429, 143.0, 425.0, 429.0, 429.0, 0.06592392379194409, 0.05105241363965983, 0.023433894785417627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 137.1333333333333, 130, 146, 136.0, 144.8, 146.0, 146.0, 0.1266228832874677, 0.1027574375116071, 0.04501047804359204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 289.6428571428571, 265, 518, 269.5, 404.5, 518.0, 518.0, 0.06764494136633117, 0.10483644721520272, 0.1521350585611921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b34144a-2bd0-4a2b-aa26-bab84b507013", 3, 0, 0.0, 442.3333333333333, 267, 589, 471.0, 589.0, 589.0, 589.0, 0.022176227084565348, 0.02621154965626848, 0.014221083123891188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 496.6666666666667, 264, 1328, 283.0, 1235.6000000000001, 1328.0, 1328.0, 0.07785574886849644, 12.523578735194432, 0.17244338751660923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e74c35f-f070-4a83-a10b-96d8526b883d", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a3503d2-f9ac-4bce-a10d-1463cb3144b4", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31954851-1b9b-4fab-b3cb-8357a936c7f6", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 139.11111111111111, 131, 171, 135.0, 171.0, 171.0, 171.0, 0.08001920460910618, 0.06634404757141714, 0.028444326638393216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e614134-ba2a-42b6-ac0e-84afff55be08", 3, 0, 0.0, 580.3333333333334, 450, 699, 592.0, 699.0, 699.0, 699.0, 0.01682434819671028, 0.023193722204774753, 0.01078905141520809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5e1a3eb-feea-4695-9f8c-1e4ca45388e1", 3, 0, 0.0, 520.3333333333334, 462, 631, 468.0, 631.0, 631.0, 631.0, 0.018776169285942283, 0.022192796444419412, 0.012040707517352311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a05e44e6-8e59-4107-8f49-2cbbaaf5f743", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 142.58333333333334, 130, 173, 139.0, 170.9, 173.0, 173.0, 0.07659704846039932, 0.05946743508400144, 0.027227857069907574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc14afd4-5db9-45d6-8103-2c4c30f6063f", 3, 0, 0.0, 499.0, 384, 613, 500.0, 613.0, 613.0, 613.0, 0.05857315787418486, 0.02650282859541567, 0.03756156282947401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 146.44444444444446, 128, 397, 132.0, 162.10000000000036, 397.0, 397.0, 0.08785973681127729, 0.06529419893884962, 0.044101469454098166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 203.38888888888886, 127, 395, 132.5, 395.0, 395.0, 395.0, 0.08785930796151763, 0.02350922888814046, 0.05010726157180302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 181.11111111111111, 125, 511, 132.0, 404.8000000000002, 511.0, 511.0, 0.08786102338567572, 0.02368129145942041, 0.05165267195134452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 241.33333333333334, 129, 511, 141.5, 411.10000000000014, 511.0, 511.0, 0.08785845027455766, 0.02368059792556437, 0.05173695851128737], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3257328990228013], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.40716612377850164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1228, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

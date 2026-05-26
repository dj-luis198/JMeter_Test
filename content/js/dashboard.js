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

    var data = {"OkPercent": 98.85496183206106, "KoPercent": 1.1450381679389312};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8222733245729303, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fdd4031-ebd3-448e-a2d0-8084412f08d7"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "see books"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/332bfc0c-f4ac-48d6-bbaf-d0f739db131c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82933102-51e2-413f-a17e-fddc703e4ffd"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b422e871-071b-4522-8543-0d4a07d79dde"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69090226-cdfa-4348-924d-95592b20e36e"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c79119d-1ce7-4261-bcc7-e5a4482d5f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29bd9947-dc47-4fa7-8380-239e1c900e19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e72b88c-5f2a-4914-93b4-613c45319494"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6aa5e8d-b2e9-41b2-8893-a13ba3c49061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d8fd560-82e0-4e25-8352-bac1daa3d650"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa7f882f-dda0-4e30-89d0-92282c274721"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3d25f1f-f11b-4022-a25b-32a24b9b706c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da43a1ea-134a-4981-92ca-f18e43d3067a"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=332bfc0c-f4ac-48d6-bbaf-d0f739db131c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fdd4031-ebd3-448e-a2d0-8084412f08d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6aa5e8d-b2e9-41b2-8893-a13ba3c49061"], "isController": false}, {"data": [0.4083333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46b92d16-a797-4ae4-bf63-24ff7b785f38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=468da685-d0f4-45c0-a6c8-8e9e62e2f00d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7767857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b422e871-071b-4522-8543-0d4a07d79dde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9460227272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da43a1ea-134a-4981-92ca-f18e43d3067a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/468da685-d0f4-45c0-a6c8-8e9e62e2f00d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d8fd560-82e0-4e25-8352-bac1daa3d650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e72b88c-5f2a-4914-93b4-613c45319494"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82933102-51e2-413f-a17e-fddc703e4ffd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29bd9947-dc47-4fa7-8380-239e1c900e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69090226-cdfa-4348-924d-95592b20e36e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/157ab8a4-c896-45c9-9ec2-9caa934b8990"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3d25f1f-f11b-4022-a25b-32a24b9b706c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1310, 15, 1.1450381679389312, 299.30381679389325, 77, 2773, 93.0, 845.9000000000001, 1023.8000000000002, 1394.89, 5.0890782941098776, 709.7351794555658, 3.7213278026836147], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fdd4031-ebd3-448e-a2d0-8084412f08d7", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1311.3035714285713, 946, 1756, 1266.5, 1614.5000000000002, 1693.1499999999999, 1756.0, 0.24691684634276467, 297.12461233228396, 1.2140882044295118], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 541.7692307692307, 82, 1359, 450.0, 1153.3999999999999, 1359.0, 1359.0, 0.06718346253229975, 0.012728116925064599, 0.04541646479328165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 541.7692307692307, 82, 1359, 450.0, 1153.3999999999999, 1359.0, 1359.0, 0.06699580503190031, 0.012692564625184238, 0.0452896070824873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 128.05882352941177, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.10090218423551757, 0.026999217266144352, 0.057545776946818616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 102.88235294117646, 80, 239, 81.0, 236.6, 239.0, 239.0, 0.10080764714951554, 0.07491662058670051, 0.05060071351059666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 108.88235294117646, 78, 234, 79.0, 233.2, 234.0, 234.0, 0.1009009864555264, 0.0271959690055911, 0.05941728011004143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 127.35294117647057, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.1009009864555264, 0.0271959690055911, 0.059318743990455954], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 237.0, 79, 451, 197.0, 427.4, 451.0, 451.0, 0.06753667761107185, 0.15307366563110428, 0.043656333446760315], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 81.52941176470587, 79, 91, 81.0, 87.0, 91.0, 91.0, 0.11210836262439082, 0.08331490620816544, 0.05627314295794617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.23529411764704, 77, 240, 80.0, 234.4, 240.0, 240.0, 0.11210910194014692, 0.049807662821983935, 0.06282952656985716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 540.8, 430, 713, 471.0, 713.0, 713.0, 713.0, 0.07825705878670257, 23.01017366219558, 0.044630978839291305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 811.0, 686, 959, 846.0, 959.0, 959.0, 959.0, 0.07796663028223921, 70.15451097867613, 0.04438920454545455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 82.6, 79, 89, 82.0, 89.0, 89.0, 89.0, 0.07872651981546504, 0.13930903701720962, 0.04359173509313347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/332bfc0c-f4ac-48d6-bbaf-d0f739db131c", 3, 0, 0.0, 331.6666666666667, 197, 464, 334.0, 464.0, 464.0, 464.0, 0.04204271539884523, 0.03504928194545659, 0.02696098611188968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 81.15, 79, 84, 81.0, 83.0, 83.95, 84.0, 0.0974022811614248, 0.07238587496469168, 0.04889137941110581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 103.15, 78, 238, 80.0, 236.70000000000002, 237.95, 238.0, 0.09740417863926362, 0.03337805301222422, 0.05514179917693469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82933102-51e2-413f-a17e-fddc703e4ffd", 1, 0, 0.0, 2773.0, 2773, 2773, 2773.0, 2773.0, 2773.0, 2773.0, 0.3606202668589975, 0.06515112243058059, 0.24863076992426975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 141.65, 77, 857, 80.0, 236.0, 825.9499999999996, 857.0, 0.09740465302027478, 4.407184818328147, 0.056844746723550985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 130.55, 78, 628, 80.0, 236.9, 608.4499999999997, 628.0, 0.09740512740590665, 1.4569581200566897, 0.05694014576677316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 79.6, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.07873147841970177, 0.05851040534901664, 0.044209570401688006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 647.7857142857143, 79, 1128, 734.5, 1070.5, 1128.0, 1128.0, 0.08540491078236999, 54.897640403385694, 0.044966257434802495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 186.64705882352936, 79, 1090, 80.0, 802.7999999999997, 1090.0, 1090.0, 0.11210762331838565, 11.894265921755474, 0.06477357969533105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 462.49999999999983, 80, 703, 620.0, 699.0, 703.0, 703.0, 0.08540386879525642, 17.94341478981498, 0.045049111037229986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 153.88235294117646, 78, 626, 80.0, 437.1999999999998, 626.0, 626.0, 0.11210910194014692, 3.904755898917158, 0.06488391555876495], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 605.3076923076923, 97, 2773, 434.0, 1943.3999999999992, 2773.0, 2773.0, 0.06721298761729959, 0.012733710544683712, 0.04597162351679032], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b422e871-071b-4522-8543-0d4a07d79dde", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 240.39999999999998, 160, 936, 164.0, 321.8, 905.2999999999996, 936.0, 0.09736434712337037, 5.967431359656596, 0.21772911960723224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69090226-cdfa-4348-924d-95592b20e36e", 3, 0, 0.0, 299.3333333333333, 191, 437, 270.0, 437.0, 437.0, 437.0, 0.018760904775900995, 0.025863421785787988, 0.01203091875277505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 666.8571428571428, 152, 1149, 688.0, 1058.8000000000002, 1143.5, 1149.0, 0.09471875295996103, 0.05818173399591356, 0.04282693615279488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 81.71428571428571, 79, 87, 81.5, 85.5, 87.0, 87.0, 0.08540386879525642, 0.06346908608709975, 0.04286873882886895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 149.5, 78, 253, 81.0, 249.5, 253.0, 253.0, 0.08540438978563498, 0.11447619657650404, 0.043583880836475], "isController": false}, {"data": ["login", 21, 0, 0.0, 2348.952380952381, 1506, 3755, 2185.0, 3354.2, 3715.0999999999995, 3755.0, 0.09257259234116086, 26.49611067687096, 0.17622112479005858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 102.11764705882354, 80, 247, 83.0, 240.6, 247.0, 247.0, 0.10708796331292363, 0.08669523592423212, 0.03806642445889082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c79119d-1ce7-4261-bcc7-e5a4482d5f1b", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29bd9947-dc47-4fa7-8380-239e1c900e19", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e72b88c-5f2a-4914-93b4-613c45319494", 3, 0, 0.0, 424.3333333333333, 174, 704, 395.0, 704.0, 704.0, 704.0, 0.019244832762403293, 0.022746740807384886, 0.012341250176410967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6aa5e8d-b2e9-41b2-8893-a13ba3c49061", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d8fd560-82e0-4e25-8352-bac1daa3d650", 3, 0, 0.0, 353.0, 173, 451, 435.0, 451.0, 451.0, 451.0, 0.019476851761681242, 0.026850412503489605, 0.01249003840185939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 730.7142857142857, 161, 1212, 816.0, 1155.5, 1212.0, 1212.0, 0.08536116920412905, 72.98182283441763, 0.17637894490546252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa7f882f-dda0-4e30-89d0-92282c274721", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3d25f1f-f11b-4022-a25b-32a24b9b706c", 3, 0, 0.0, 352.3333333333333, 213, 574, 270.0, 574.0, 574.0, 574.0, 0.023251668307201042, 0.023319788429194795, 0.014910737814188169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 268.3529411764706, 159, 477, 312.0, 473.8, 477.0, 477.0, 0.10075925058825622, 0.1561571588706666, 0.2266099161179239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 663.2857142857142, 79, 1039, 793.0, 1039.0, 1039.0, 1039.0, 0.10127314814814814, 86.54909487123842, 0.18228601526331017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da43a1ea-134a-4981-92ca-f18e43d3067a", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1073.826086956522, 481, 1470, 1082.0, 1436.6000000000001, 1469.0, 1470.0, 0.09441823996190428, 0.02989055694446155, 0.042598854357812285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=332bfc0c-f4ac-48d6-bbaf-d0f739db131c", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 302.7058823529412, 161, 1171, 167.0, 882.1999999999997, 1171.0, 1171.0, 0.11204851041392037, 15.923690896470472, 0.24862694231149485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 106.5, 81, 245, 84.0, 241.5, 245.0, 245.0, 0.10157587718025365, 0.07886017808427895, 0.03610705009141829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 335.5714285714285, 159, 1076, 315.0, 775.0000000000002, 1053.3999999999996, 1076.0, 0.11966902965512524, 13.802635006966446, 0.2662224102339814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 81.2, 79, 86, 80.0, 86.0, 86.0, 86.0, 0.026349072512647554, 0.01958168377160624, 0.013225999288575043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 79.8, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.026350183397276444, 0.007050732666849361, 0.015027838968759222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 111.2, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.026328676668053313, 0.007096401133186244, 0.015478382181804777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 79.4, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.026350322264441294, 0.007102235297837692, 0.015516840161580175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 3.040431701030928, 6.372825386597938], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 917.1071428571429, 622, 1413, 855.0, 1283.3000000000002, 1363.1999999999998, 1413.0, 0.2521613832853026, 301.67267989012964, 0.49792023144812675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1073.826086956522, 481, 1470, 1082.0, 1436.6000000000001, 1469.0, 1470.0, 0.08995549158720599, 0.028477757526927983, 0.04058538780594645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 98.75, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.03727865796831314, 0.010047763280521902, 0.021952178471575025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 79.25, 77, 80, 80.0, 80.0, 80.0, 80.0, 0.03727831054696601, 0.010047669639611933, 0.02191556928639994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 91.50000000000001, 78, 237, 80.0, 161.0, 237.0, 237.0, 0.10698374611228709, 0.02883546281932738, 0.06289474136679378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 136.3571428571429, 78, 237, 83.5, 237.0, 237.0, 237.0, 0.10698456365581538, 0.028835683172856483, 0.06299969910591471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 99.0, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.03727831054696601, 0.00997486043932489, 0.021260286483816553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 80.92857142857143, 79, 90, 80.5, 85.5, 90.0, 90.0, 0.10698211106271445, 0.07950526027219305, 0.053700004967026586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fdd4031-ebd3-448e-a2d0-8084412f08d7", 3, 0, 0.0, 306.0, 202, 493, 223.0, 493.0, 493.0, 493.0, 0.07052683546089288, 0.031911556409713895, 0.04522716987563768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 100.12500000000001, 79, 234, 81.5, 234.0, 234.0, 234.0, 0.037277789427086976, 0.027703513431653504, 0.018711702896018267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 120.07142857142858, 78, 322, 80.5, 280.0, 322.0, 322.0, 0.10698374611228709, 0.02862651019020182, 0.06101416770466373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 85.375, 82, 96, 84.0, 96.0, 96.0, 96.0, 0.03660958622015175, 0.028815748528752256, 0.013013563851694566], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 649.7692307692307, 79, 2279, 493.0, 1788.9999999999995, 2279.0, 2279.0, 0.0678613748714549, 0.012713812269336577, 0.046185701347309295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1239.2380952380954, 767, 1916, 1141.0, 1783.6000000000001, 1904.1999999999998, 1916.0, 0.09438244666268163, 0.04885028977658327, 0.04341223865051079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 200.125, 158, 470, 162.5, 470.0, 470.0, 470.0, 0.03726389826955773, 0.0577517642126837, 0.08380738058085101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6aa5e8d-b2e9-41b2-8893-a13ba3c49061", 3, 0, 0.0, 550.6666666666666, 186, 785, 681.0, 785.0, 785.0, 785.0, 0.018787222183951954, 0.022205860595680194, 0.0120477954760369], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 913.0999999999995, 412, 2351, 726.5, 1523.6, 1604.95, 2351.0, 0.278671849963076, 84.41492845100252, 1.0142993130158333], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/46b92d16-a797-4ae4-bf63-24ff7b785f38", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=468da685-d0f4-45c0-a6c8-8e9e62e2f00d", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 151.41071428571433, 78, 472, 81.0, 323.0, 340.0499999999999, 472.0, 0.2531267939231489, 0.18811473649952765, 0.12236109667183467], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 525.1785714285712, 382, 796, 473.0, 633.8000000000001, 708.65, 796.0, 0.25300671371386746, 74.39237444541833, 0.12724458746351733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b422e871-071b-4522-8543-0d4a07d79dde", 3, 0, 0.0, 912.3333333333334, 185, 2279, 273.0, 2279.0, 2279.0, 2279.0, 0.08505571149102663, 0.0384854944572028, 0.054544189986107564], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 117.57142857142858, 78, 322, 83.5, 242.3, 274.79999999999995, 322.0, 0.2534452716616506, 0.4484793283700301, 0.12325756375732615], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 763.875, 541, 1089, 768.5, 938.9, 1015.9999999999999, 1089.0, 0.2525765058746589, 227.26878396815732, 0.1267815664253659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 91.19047619047619, 81, 240, 83.0, 90.8, 225.0999999999998, 240.0, 0.11943218526775558, 0.08922423997054006, 0.042454409606897496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, 3.409090909090909, 161.57954545454544, 79, 1870, 88.0, 290.3000000000001, 412.20000000000016, 1300.1999999999925, 0.7527769342303925, 1.5959962010962314, 0.3630265762870989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 89.6, 82, 103, 83.0, 103.0, 103.0, 103.0, 0.026503686662814798, 0.020524827659777475, 0.009421232368422449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da43a1ea-134a-4981-92ca-f18e43d3067a", 3, 0, 0.0, 316.3333333333333, 185, 430, 334.0, 430.0, 430.0, 430.0, 0.02224694104560623, 0.02231211763070078, 0.014266430292918058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 83.64705882352942, 81, 92, 82.0, 92.0, 92.0, 92.0, 0.10355750487329435, 0.08403934233369884, 0.03681145681042885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/468da685-d0f4-45c0-a6c8-8e9e62e2f00d", 3, 0, 0.0, 393.0, 245, 542, 392.0, 542.0, 542.0, 542.0, 0.030184123151222455, 0.02516326152027367, 0.01935635501559513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d8fd560-82e0-4e25-8352-bac1daa3d650", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 193.6, 160, 316, 163.0, 316.0, 316.0, 316.0, 0.026316482012684543, 0.040785407181767944, 0.059186384839074714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e72b88c-5f2a-4914-93b4-613c45319494", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82933102-51e2-413f-a17e-fddc703e4ffd", 3, 0, 0.0, 316.66666666666663, 173, 584, 193.0, 584.0, 584.0, 584.0, 0.05180452426178553, 0.03391240178725609, 0.03322100025902262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 235.42857142857144, 160, 402, 166.0, 365.0, 402.0, 402.0, 0.10691675003627532, 0.16570008037848527, 0.24045827669291217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29bd9947-dc47-4fa7-8380-239e1c900e19", 3, 0, 0.0, 476.6666666666667, 181, 1054, 195.0, 1054.0, 1054.0, 1054.0, 0.017190203875817968, 0.023698083793648794, 0.011023665896927538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 92.80000000000003, 81, 249, 84.0, 93.0, 241.19999999999987, 249.0, 0.0966832800769599, 0.08016025857943257, 0.034367884714856835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 86.71428571428572, 81, 103, 84.0, 99.5, 103.0, 103.0, 0.08958967926894822, 0.06955448732306038, 0.03184633130263394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69090226-cdfa-4348-924d-95592b20e36e", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/157ab8a4-c896-45c9-9ec2-9caa934b8990", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.8337752937336814, 1.557910411227154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3d25f1f-f11b-4022-a25b-32a24b9b706c", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 118.23809523809524, 80, 240, 81.0, 235.8, 239.6, 240.0, 0.11983018351136675, 0.08905348598842783, 0.060149135082854015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 139.3809523809524, 78, 245, 80.0, 241.2, 244.7, 245.0, 0.11983223487118036, 0.04920566563953322, 0.06738334189277868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 193.61904761904765, 78, 841, 81.0, 662.2000000000004, 833.6999999999999, 841.0, 0.11972565720833975, 10.289135235118385, 0.06940569395271406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 172.85714285714286, 77, 620, 81.0, 487.2000000000002, 612.8, 620.0, 0.11972633979475485, 3.381912770809578, 0.0695230099059293], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.3816793893129771], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07633587786259542], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07633587786259542], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6106870229007634], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1310, 15, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

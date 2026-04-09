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

    var data = {"OkPercent": 98.76352395672333, "KoPercent": 1.2364760432766615};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8150730411686588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7354178d-6cc9-4cc1-900c-eb6bf404bb12"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c499bd0b-5399-4d6a-9e5e-37fd3e73c302"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03826beb-db20-4422-a0a8-7f981e04b62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae5cbf5a-f046-4905-be87-deb509222e3c"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ada810e4-9e35-417f-a5a9-69f8517ccd6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea69d682-f74d-410d-9b48-b9578821822f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97e7a3a4-17de-4c27-8983-0dd0b8166124"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea69d682-f74d-410d-9b48-b9578821822f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8949f7e6-bf64-4fc1-8c6b-7ae07a251b67"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22943553-97d5-4a51-93ae-8f2580efec51"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5038ef5f-4c2d-474b-bf61-6bbb3b09a24b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60e68948-001f-46cf-bb91-dd39df7bbde5"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/995c4c37-18c8-41f0-b3ea-bd13741c78a5"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03826beb-db20-4422-a0a8-7f981e04b62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dde9f145-7b27-4f66-b297-3744a2605b1c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2f8b98e-1df9-4720-b393-8b7b207c9c7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c499bd0b-5399-4d6a-9e5e-37fd3e73c302"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97e7a3a4-17de-4c27-8983-0dd0b8166124"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ada810e4-9e35-417f-a5a9-69f8517ccd6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae5cbf5a-f046-4905-be87-deb509222e3c"], "isController": false}, {"data": [0.4032258064516129, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6851851851851852, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9719101123595506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5038ef5f-4c2d-474b-bf61-6bbb3b09a24b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8949f7e6-bf64-4fc1-8c6b-7ae07a251b67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/068c98b6-0d69-4940-b5c0-efef3e69835e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d00b073-bdab-4a28-b117-3941cda8a9da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01f3ac9a-0eb3-44b4-b711-72362f454a65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22943553-97d5-4a51-93ae-8f2580efec51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60e68948-001f-46cf-bb91-dd39df7bbde5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=995c4c37-18c8-41f0-b3ea-bd13741c78a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56e95443-14f6-4849-ba63-f88067ec7afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 16, 1.2364760432766615, 302.7457496136014, 82, 2135, 99.0, 848.5, 1001.5, 1375.3999999999996, 5.220646972912346, 727.370614116928, 3.8011362232310724], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7354178d-6cc9-4cc1-900c-eb6bf404bb12", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1428.4074074074076, 1031, 1919, 1428.5, 1702.5, 1808.0, 1919.0, 0.23381380627227186, 281.35598493659967, 1.1496606587703992], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c499bd0b-5399-4d6a-9e5e-37fd3e73c302", 3, 0, 0.0, 354.6666666666667, 316, 405, 343.0, 405.0, 405.0, 405.0, 0.03270467676877794, 0.027264543360950615, 0.020972725662269702], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 495.46153846153845, 90, 1176, 440.0, 1062.8, 1176.0, 1176.0, 0.08239163914997179, 0.016333498776801052, 0.055394018208552255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 495.46153846153845, 90, 1176, 440.0, 1062.8, 1176.0, 1176.0, 0.08244650490239602, 0.01634437548358046, 0.05543090586511752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 100.07142857142858, 83, 276, 86.0, 185.0, 276.0, 276.0, 0.06417455478902614, 0.02405650512250464, 0.03621457507276936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03826beb-db20-4422-a0a8-7f981e04b62f", 3, 0, 0.0, 286.3333333333333, 186, 414, 259.0, 414.0, 414.0, 414.0, 0.02519399375188955, 0.029721039504182204, 0.016156304586986463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 86.92857142857144, 84, 92, 86.5, 91.0, 92.0, 92.0, 0.06417602567041027, 0.04769331595232638, 0.03221335663534265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 161.57142857142856, 85, 796, 87.0, 525.0, 796.0, 796.0, 0.06417484895990906, 1.3638856467220404, 0.03739653238079522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 163.14285714285714, 84, 822, 87.0, 536.5, 822.0, 822.0, 0.0641769082316053, 4.140811764830596, 0.03733505961576369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae5cbf5a-f046-4905-be87-deb509222e3c", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 208.46153846153845, 88, 381, 185.0, 361.79999999999995, 381.0, 381.0, 0.08245487181438774, 0.168991606649034, 0.05329339821897477], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 86.72727272727273, 83, 91, 87.0, 89.7, 90.85, 91.0, 0.11889771013819156, 0.08836050528824589, 0.05968107715920944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 94.4090909090909, 83, 258, 86.0, 94.19999999999999, 233.69999999999965, 258.0, 0.11889899530348969, 0.03181477022769157, 0.06780958325902146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 615.3333333333334, 434, 731, 681.0, 731.0, 731.0, 731.0, 0.026492639461669566, 7.789715640150478, 0.015109083442983423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 865.0, 829, 926, 840.0, 926.0, 926.0, 926.0, 0.02645549304220533, 23.80469914317272, 0.015062062933208699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 197.33333333333334, 84, 255, 253.0, 255.0, 255.0, 255.0, 0.026593151377082024, 0.04705741239772717, 0.014724918780083501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ada810e4-9e35-417f-a5a9-69f8517ccd6a", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 88.0, 84, 94, 87.5, 93.7, 94.0, 94.0, 0.12060980316480124, 0.08963287129727904, 0.060540467604206866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea69d682-f74d-410d-9b48-b9578821822f", 3, 0, 0.0, 531.6666666666666, 160, 1057, 378.0, 1057.0, 1057.0, 1057.0, 0.027810223037988763, 0.02318423867196915, 0.017834029747668578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97e7a3a4-17de-4c27-8983-0dd0b8166124", 3, 0, 0.0, 332.0, 217, 398, 381.0, 398.0, 398.0, 398.0, 0.030356998300008094, 0.0253073804187242, 0.019467215706710922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 102.9, 83, 256, 86.5, 239.30000000000007, 256.0, 256.0, 0.12061416734009577, 0.05038939530087204, 0.06777479676512803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 168.7, 84, 750, 86.0, 700.0000000000002, 750.0, 750.0, 0.12061125785480817, 10.88187983575762, 0.06986972476510958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 204.10000000000002, 84, 761, 88.5, 710.5000000000002, 761.0, 761.0, 0.12061271257990593, 3.5756722274152697, 0.06998835333494151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.02663257696814744, 0.01979237409449238, 0.014954816168637476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 632.1176470588235, 85, 1185, 920.0, 1073.0, 1185.0, 1185.0, 0.08944073236176146, 47.350472441074345, 0.048060007497237864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 101.68181818181819, 83, 250, 87.0, 202.19999999999987, 249.85, 250.0, 0.11889706756596086, 0.032046475242387885, 0.06989847136201996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 429.11764705882354, 85, 784, 511.0, 752.0, 784.0, 784.0, 0.08944543828264759, 15.480473271598443, 0.04814988523361044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 117.09090909090907, 84, 256, 87.0, 252.8, 255.7, 256.0, 0.11889771013819156, 0.03204664843568445, 0.07001496016926712], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 463.15384615384613, 95, 993, 412.0, 961.8, 993.0, 993.0, 0.08246114811290833, 0.016347278385664445, 0.05594869965112591], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 293.1, 170, 849, 182.0, 798.7000000000002, 849.0, 849.0, 0.12048483095978216, 14.582229673455986, 0.26789049133714066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea69d682-f74d-410d-9b48-b9578821822f", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8949f7e6-bf64-4fc1-8c6b-7ae07a251b67", 3, 0, 0.0, 324.6666666666667, 178, 511, 285.0, 511.0, 511.0, 511.0, 0.031758130081300816, 0.026475446334053184, 0.020365727949271682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 385.7142857142858, 96, 743, 374.0, 695.8000000000001, 739.3, 743.0, 0.09688536615748024, 0.059512593079155345, 0.04380656692472007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 107.17647058823529, 83, 257, 86.0, 250.6, 257.0, 257.0, 0.08952362897195278, 0.06653074379653912, 0.04493666532381223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 145.64705882352945, 83, 265, 86.0, 263.4, 265.0, 265.0, 0.08952504331432243, 0.10305048356688838, 0.046634483730139925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22943553-97d5-4a51-93ae-8f2580efec51", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 0.18193762588116819, 0.6943133182275931], "isController": false}, {"data": ["login", 21, 0, 0.0, 2012.952380952381, 1367, 3112, 1993.0, 2670.8, 3070.6999999999994, 3112.0, 0.09768577741597861, 16.83246689295267, 0.1705276412954995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 113.77272727272728, 86, 275, 89.0, 255.7, 272.15, 275.0, 0.12296548023609373, 0.09954920226144696, 0.04371038555267394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5038ef5f-4c2d-474b-bf61-6bbb3b09a24b", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60e68948-001f-46cf-bb91-dd39df7bbde5", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 740.8235294117648, 174, 1276, 1007.0, 1160.8, 1276.0, 1276.0, 0.08940028187382991, 62.971061629990636, 0.18760809381507815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 288.64285714285717, 172, 909, 179.0, 636.0, 909.0, 909.0, 0.06414838437711919, 5.574014026445171, 0.14309886526090065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 457.8571428571429, 86, 1012, 89.0, 1012.0, 1012.0, 1012.0, 0.05900401227283455, 30.26158401539162, 0.07936072577042382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/995c4c37-18c8-41f0-b3ea-bd13741c78a5", 3, 0, 0.0, 404.0, 333, 484, 395.0, 484.0, 484.0, 484.0, 0.018261949402225523, 0.025175571522924833, 0.011710950625776132], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 876.9130434782608, 133, 2135, 872.0, 1366.2, 1982.9999999999977, 2135.0, 0.0896284316972897, 0.028374218186777857, 0.04043782758217563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03826beb-db20-4422-a0a8-7f981e04b62f", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 220.6363636363636, 169, 347, 178.0, 341.4, 346.25, 347.0, 0.1188405483951124, 0.1841796389678158, 0.2672751786659608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.88235294117646, 87, 130, 91.0, 124.39999999999999, 130.0, 130.0, 0.10180859983231524, 0.07904085631512757, 0.036189775721643315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dde9f145-7b27-4f66-b297-3744a2605b1c", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 384.84210526315786, 173, 1171, 337.0, 1042.0, 1171.0, 1171.0, 0.08959305889564766, 17.04078768213326, 0.19787743286414863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 86.0, 84, 87, 86.0, 87.0, 87.0, 87.0, 0.0508879955218564, 0.0378181294845046, 0.02554338837718182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 125.33333333333333, 84, 264, 87.0, 264.0, 264.0, 264.0, 0.050888570992383676, 0.013616668410071414, 0.029022388144093816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 141.66666666666666, 82, 254, 90.0, 254.0, 254.0, 254.0, 0.05084027679706256, 0.013703043355458269, 0.029888522101398106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 125.77777777777777, 84, 252, 89.0, 252.0, 252.0, 252.0, 0.050888570992383676, 0.013716060150290914, 0.02996660967617906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 99.0, 95, 103, 99.0, 103.0, 103.0, 103.0, 0.025238185374471575, 0.007443292952236734, 0.015601339201211432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2f8b98e-1df9-4720-b393-8b7b207c9c7c", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c499bd0b-5399-4d6a-9e5e-37fd3e73c302", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 988.7962962962961, 655, 1559, 930.0, 1310.0, 1428.0, 1559.0, 0.24638858217059217, 294.76640280654846, 0.4865212042470091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 876.9130434782608, 133, 2135, 872.0, 1366.2, 1982.9999999999977, 2135.0, 0.09281791143557025, 0.02938393120174982, 0.04187683113597017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 150.25, 83, 424, 89.0, 424.0, 424.0, 424.0, 0.04968296060762261, 0.013391110476273282, 0.02925666527968402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 108.25, 83, 255, 86.0, 255.0, 255.0, 255.0, 0.049683577714431215, 0.013391276805842789, 0.029208509554773037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97e7a3a4-17de-4c27-8983-0dd0b8166124", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 218.41176470588238, 84, 840, 88.0, 769.5999999999999, 840.0, 840.0, 0.10420114498669902, 16.569077457844507, 0.059678619917129444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 220.7058823529412, 83, 693, 87.0, 676.1999999999999, 693.0, 693.0, 0.1042017836893561, 5.4299736239235035, 0.05978074527261025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 87.11764705882354, 84, 94, 86.0, 90.8, 94.0, 94.0, 0.10420114498669902, 0.07743854622546677, 0.05230409035465167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 164.125, 85, 356, 96.5, 356.0, 356.0, 356.0, 0.049682652059966956, 0.013293990883233348, 0.02833463750294991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 106.29411764705884, 82, 260, 86.0, 253.6, 260.0, 260.0, 0.10420114498669902, 0.05550051794098538, 0.05788287408211051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 107.375, 85, 250, 87.0, 250.0, 250.0, 250.0, 0.049682652059966956, 0.03692236154065904, 0.024938362459788106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 94.5, 89, 107, 92.5, 107.0, 107.0, 107.0, 0.04931118439301014, 0.038813295528091964, 0.017528585077202823], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 448.15384615384613, 86, 835, 414.0, 775.0, 835.0, 835.0, 0.08345959271718753, 0.016194120191443465, 0.05679540643216661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1201.8095238095239, 840, 1930, 1117.0, 1796.0, 1919.8999999999999, 1930.0, 0.09766033734670815, 0.050546854290776676, 0.04491994032255814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 313.75, 173, 510, 263.0, 510.0, 510.0, 510.0, 0.049655823076302376, 0.0769568273653241, 0.1116771099069574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ada810e4-9e35-417f-a5a9-69f8517ccd6a", 3, 0, 0.0, 398.33333333333337, 188, 685, 322.0, 685.0, 685.0, 685.0, 0.02890479723284741, 0.02898947925599052, 0.018535953954658006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae5cbf5a-f046-4905-be87-deb509222e3c", 3, 0, 0.0, 296.0, 176, 398, 314.0, 398.0, 398.0, 398.0, 0.02445924681825964, 0.024530904767922513, 0.015685128981761554], "isController": false}, {"data": ["addBook", 62, 3, 4.838709677419355, 943.6451612903228, 445, 2545, 733.5, 1556.6000000000001, 1697.7999999999997, 2545.0, 0.3065134099616858, 107.62284096527004, 1.1129360554937584], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 159.59259259259258, 84, 365, 89.0, 349.0, 354.5, 365.0, 0.24714524359825168, 0.18366946326002884, 0.11946962459095174], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 552.3888888888887, 400, 818, 512.0, 721.0, 789.75, 818.0, 0.2467996032924895, 72.56727788606999, 0.12412284735901573], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 141.16666666666663, 84, 336, 89.0, 260.5, 282.5, 336.0, 0.24746123107379842, 0.43789038154855736, 0.12034735651831213], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 825.4999999999999, 567, 1209, 837.5, 1024.0, 1089.25, 1209.0, 0.24680975538410913, 222.0798517398945, 0.12388692799553915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 101.47368421052633, 86, 267, 91.0, 122.0, 267.0, 267.0, 0.09143011130413023, 0.06830472182388636, 0.03250054737764004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, 1.6853932584269662, 159.06179775280904, 85, 2008, 94.0, 272.69999999999993, 359.59999999999945, 1119.2500000000089, 0.775670104889772, 1.6088030862845837, 0.37690676488916197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 92.11111111111111, 86, 115, 90.0, 115.0, 115.0, 115.0, 0.05338268265774583, 0.041340300144133243, 0.018975875475995586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 113.07142857142858, 86, 389, 89.5, 248.5, 389.0, 389.0, 0.06407821203480361, 0.0520009708993377, 0.0227778019342466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5038ef5f-4c2d-474b-bf61-6bbb3b09a24b", 3, 0, 0.0, 376.6666666666667, 180, 540, 410.0, 540.0, 540.0, 540.0, 0.025664057487488772, 0.02573924515590915, 0.01645774519868258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8949f7e6-bf64-4fc1-8c6b-7ae07a251b67", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 251.44444444444446, 170, 351, 191.0, 351.0, 351.0, 351.0, 0.050815016401958076, 0.078753350615144, 0.11428416286495062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 327.7647058823529, 171, 927, 179.0, 858.9999999999999, 927.0, 927.0, 0.10414624583415018, 22.120296476027985, 0.22952497250845422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/068c98b6-0d69-4940-b5c0-efef3e69835e", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d00b073-bdab-4a28-b117-3941cda8a9da", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 107.10000000000001, 86, 264, 90.0, 247.00000000000006, 264.0, 264.0, 0.11489762621504239, 0.09526180142243261, 0.04084251556862835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01f3ac9a-0eb3-44b4-b711-72362f454a65", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 91.47058823529413, 86, 104, 90.0, 99.19999999999999, 104.0, 104.0, 0.08595017923140316, 0.06672889891500539, 0.030552602773662844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22943553-97d5-4a51-93ae-8f2580efec51", 3, 0, 0.0, 446.33333333333337, 185, 835, 319.0, 835.0, 835.0, 835.0, 0.026266942177704616, 0.031046636408608552, 0.01684436070640563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60e68948-001f-46cf-bb91-dd39df7bbde5", 3, 0, 0.0, 340.0, 166, 603, 251.0, 603.0, 603.0, 603.0, 0.0759032486590426, 0.03434424337111628, 0.04867493484971157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=995c4c37-18c8-41f0-b3ea-bd13741c78a5", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56e95443-14f6-4849-ba63-f88067ec7afb", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 104.1578947368421, 84, 256, 87.0, 248.0, 256.0, 256.0, 0.08962940599290513, 0.06660935347714922, 0.04498976043003245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 120.94736842105263, 83, 257, 87.0, 252.0, 257.0, 257.0, 0.08963025162513798, 0.0452389530714872, 0.04992869382777783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 252.52631578947367, 83, 956, 87.0, 923.0, 956.0, 956.0, 0.0896306744472382, 12.7545288183257, 0.05147682752227794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 232.68421052631578, 82, 703, 90.0, 668.0, 703.0, 703.0, 0.08963025162513798, 4.181544231939505, 0.05156411422903832], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.38639876352395675], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.1545595054095827], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 12.5, 0.1545595054095827], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5409582689335394], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 16, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.59217456734386, "KoPercent": 2.4078254326561326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7292337411461687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e5bef8f-f969-4a73-895b-a0714def75fb"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e3f6dc3-c95c-4b35-ab94-b9baabd0275d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c75aaaf0-160b-47be-972b-a28b5bcc60c5"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f86a5e82-dfc2-4ee3-91f8-b1656d1b5086"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c472be4-e1e1-4bc1-af15-ba431a0c7318"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62d4f257-051d-41fb-99e4-df3cb6724f8a"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2982573-ae00-46ef-a75a-f3736e6be9ee"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5a2eea2-1400-46ed-80b4-d3f5163e5fb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e131a63-b7f2-4f78-aedc-143b659d3d1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a53083a-0c57-439b-a43c-e224959cfa1a"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18937b99-c27e-49ef-b6c1-9d05c71aaf62"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e5bef8f-f969-4a73-895b-a0714def75fb"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b926ec29-8e39-460f-bcef-239f16c2745e"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e098880-82f3-4334-bfe1-055ad0b8e325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0a53083a-0c57-439b-a43c-e224959cfa1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e3f6dc3-c95c-4b35-ab94-b9baabd0275d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2601b36f-1828-42df-a2f7-69aeb44223b4"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c75aaaf0-160b-47be-972b-a28b5bcc60c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d0c7451-b09a-4fd8-8425-0d0830328215"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f86a5e82-dfc2-4ee3-91f8-b1656d1b5086"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62d4f257-051d-41fb-99e4-df3cb6724f8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8982558139534884, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18937b99-c27e-49ef-b6c1-9d05c71aaf62"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d0c7451-b09a-4fd8-8425-0d0830328215"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e131a63-b7f2-4f78-aedc-143b659d3d1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5a2eea2-1400-46ed-80b4-d3f5163e5fb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e098880-82f3-4334-bfe1-055ad0b8e325"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b2982573-ae00-46ef-a75a-f3736e6be9ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad321874-6fcb-4efd-ab22-18351650946a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b926ec29-8e39-460f-bcef-239f16c2745e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 32, 2.4078254326561326, 445.52069224981136, 125, 2918, 147.0, 1261.0, 1518.0, 2059.000000000001, 5.219358360595219, 755.1193775735973, 3.8112857026791924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2083.0862068965525, 1523, 3046, 2079.0, 2580.6, 2832.0499999999997, 3046.0, 0.2584048401899721, 310.9476348369265, 1.270574580426279], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e5bef8f-f969-4a73-895b-a0714def75fb", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 655.0000000000001, 133, 1681, 609.5, 1246.3000000000004, 1681.0, 1681.0, 0.08918418764353081, 0.018023000811018708, 0.05981720202726807], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 655.0000000000001, 133, 1681, 609.5, 1246.3000000000004, 1681.0, 1681.0, 0.08590419534614022, 0.017360155687931537, 0.0576172609044638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e3f6dc3-c95c-4b35-ab94-b9baabd0275d", 3, 0, 0.0, 614.6666666666666, 265, 1056, 523.0, 1056.0, 1056.0, 1056.0, 0.05541496573507952, 0.035626483504811866, 0.03553628987568576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 179.0952380952381, 125, 385, 129.0, 382.8, 384.8, 385.0, 0.11042460891284343, 0.0453426942289996, 0.06209330222163796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 185.42857142857142, 126, 523, 129.0, 395.6, 510.49999999999983, 523.0, 0.11041299718709745, 0.08205497154236442, 0.05542214897867978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 276.5238095238096, 126, 1045, 132.0, 891.4000000000004, 1041.6, 1045.0, 0.11042518956324208, 3.119182958764079, 0.06412199321410918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 269.80952380952385, 125, 1385, 129.0, 1117.6000000000008, 1376.6999999999998, 1385.0, 0.11042402826855123, 9.489760061075005, 0.06401348290530877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c75aaaf0-160b-47be-972b-a28b5bcc60c5", 3, 0, 0.0, 480.6666666666667, 375, 659, 408.0, 659.0, 659.0, 659.0, 0.023477301362466056, 0.023546082518801404, 0.015055430886737673], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 247.6875, 128, 408, 244.5, 388.40000000000003, 408.0, 408.0, 0.08975150053289954, 0.1417596027093734, 0.058006508736747626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f86a5e82-dfc2-4ee3-91f8-b1656d1b5086", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 173.5, 128, 453, 131.5, 425.0, 453.0, 453.0, 0.07449661572517134, 0.05536320758481972, 0.037393809065173894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 202.0, 126, 392, 129.5, 389.5, 392.0, 392.0, 0.07439487738130031, 0.01990644179929325, 0.04242832850652284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 892.3333333333333, 762, 1016, 890.0, 1016.0, 1016.0, 1016.0, 0.050461300387710996, 14.837297786851467, 0.028778710377366422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1367.8333333333335, 1129, 1553, 1374.5, 1553.0, 1553.0, 1553.0, 0.05021046553469962, 45.17946514870666, 0.028586622467509645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 303.0, 129, 395, 385.0, 395.0, 395.0, 395.0, 0.05073909955011332, 0.08978442225078646, 0.028094794379799073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 132.0, 128, 145, 131.0, 143.4, 145.0, 145.0, 0.06627224638816258, 0.04925115185682785, 0.03326556117530816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 156.7272727272727, 126, 432, 129.0, 372.4000000000002, 432.0, 432.0, 0.06627304494517412, 0.026782217737076758, 0.03729035501265213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c472be4-e1e1-4bc1-af15-ba431a0c7318", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 289.27272727272725, 127, 1612, 129.0, 1367.8000000000009, 1612.0, 1612.0, 0.06627304494517412, 5.437384445791662, 0.03844354364983733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 211.9090909090909, 128, 748, 132.0, 678.0000000000002, 748.0, 748.0, 0.06627264566426279, 1.7877257976816625, 0.03850803141624644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 133.0, 128, 136, 134.0, 136.0, 136.0, 136.0, 0.05073824141255264, 0.037706837612258355, 0.028490711730681413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 887.7777777777777, 128, 1658, 1254.0, 1582.4, 1658.0, 1658.0, 0.08134637285561923, 40.67397199933567, 0.04393904558108425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 150.42857142857142, 127, 392, 130.5, 269.5, 392.0, 392.0, 0.07439290079175301, 0.02005121154152718, 0.04373488894202668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 628.4444444444445, 127, 1274, 757.5, 1173.2000000000003, 1274.0, 1274.0, 0.08134710811030668, 13.297939573786346, 0.04401888326238058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 201.35714285714286, 126, 393, 130.0, 388.0, 393.0, 393.0, 0.07449621931686966, 0.020079059112750028, 0.04386837914850821], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 467.4375, 134, 921, 479.5, 798.5000000000001, 921.0, 921.0, 0.08613171692811232, 0.017406134933409416, 0.05823248464432984], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62d4f257-051d-41fb-99e4-df3cb6724f8a", 3, 0, 0.0, 368.0, 232, 640, 232.0, 640.0, 640.0, 640.0, 0.028306159420289856, 0.023007968773588468, 0.018152061867829108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 424.6363636363636, 258, 1742, 268.0, 1499.000000000001, 1742.0, 1742.0, 0.06622078008078935, 7.295397072590015, 0.14739179486909357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2982573-ae00-46ef-a75a-f3736e6be9ee", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 668.2272727272726, 200, 1738, 622.5, 1002.9999999999999, 1633.1499999999985, 1738.0, 0.09853540556277153, 0.06052614267478837, 0.044552629663635955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 147.44444444444449, 128, 398, 131.0, 183.80000000000035, 398.0, 398.0, 0.08133534563003263, 0.060445505883256666, 0.04082653091194997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 200.38888888888889, 127, 394, 130.0, 389.5, 394.0, 394.0, 0.08134747574263466, 0.0896446358118704, 0.04259797286609754], "isController": false}, {"data": ["login", 22, 0, 0.0, 3052.4090909090914, 1999, 4491, 2859.0, 4260.9, 4470.75, 4491.0, 0.09715254716314563, 31.831129897923585, 0.19051869800130714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 151.92857142857144, 128, 382, 133.0, 264.5, 382.0, 382.0, 0.07213520197856554, 0.05839851800803792, 0.025641810078318217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5a2eea2-1400-46ed-80b4-d3f5163e5fb1", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e131a63-b7f2-4f78-aedc-143b659d3d1b", 3, 0, 0.0, 364.6666666666667, 243, 483, 368.0, 483.0, 483.0, 483.0, 0.04527140205532165, 0.02910514943335295, 0.02903146551073687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a53083a-0c57-439b-a43c-e224959cfa1a", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1038.2222222222224, 257, 1789, 1401.0, 1717.0, 1789.0, 1789.0, 0.08128722842162783, 54.08253814854789, 0.17126238218996825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18937b99-c27e-49ef-b6c1-9d05c71aaf62", 3, 0, 0.0, 356.3333333333333, 252, 518, 299.0, 518.0, 518.0, 518.0, 0.03469772498583176, 0.02892606565387863, 0.02225081973375279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e5bef8f-f969-4a73-895b-a0714def75fb", 3, 0, 0.0, 467.6666666666667, 237, 662, 504.0, 662.0, 662.0, 662.0, 0.07873395795606644, 0.03562506561163163, 0.05049020090281605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 506.9523809523809, 257, 1825, 263.0, 1568.2000000000007, 1819.0, 1825.0, 0.11033700072507172, 12.726278078467997, 0.245461857221294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 878.0, 128, 1688, 1264.0, 1679.0, 1688.0, 1688.0, 0.09194941110581706, 60.013072097742224, 0.1406424364295208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b926ec29-8e39-460f-bcef-239f16c2745e", 3, 0, 0.0, 473.3333333333333, 349, 581, 490.0, 581.0, 581.0, 581.0, 0.050996124294553614, 0.03172317497620181, 0.03270259272795267], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1185.0, 147, 2338, 1224.5, 1996.0, 2301.5, 2338.0, 0.09298469239501447, 0.029057716373442018, 0.041952078014156916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e098880-82f3-4334-bfe1-055ad0b8e325", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 149.41176470588235, 130, 382, 135.0, 197.19999999999982, 382.0, 382.0, 0.08446953134316493, 0.06557937247833605, 0.030026278719640656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 431.8571428571429, 257, 847, 393.5, 818.5, 847.0, 847.0, 0.07434115154443742, 0.11521426513771699, 0.16719499219417908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 356.8947368421052, 257, 1254, 265.0, 523.0, 1254.0, 1254.0, 0.10256078075743835, 6.608391310537851, 0.2292804872041931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 134.0, 128, 156, 131.0, 156.0, 156.0, 156.0, 0.05235088178516507, 0.03890529398292052, 0.026277688708569186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 160.875, 125, 379, 130.0, 379.0, 379.0, 379.0, 0.052349854074781765, 0.014007675797353713, 0.029855776152023974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a53083a-0c57-439b-a43c-e224959cfa1a", 3, 0, 0.0, 568.3333333333334, 246, 897, 562.0, 897.0, 897.0, 897.0, 0.04546350038643975, 0.029228650150787277, 0.02915465356812706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 191.0, 128, 378, 129.0, 378.0, 378.0, 378.0, 0.0522653774540228, 0.014087152516904584, 0.030726325417306372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 128.5, 127, 131, 128.0, 131.0, 131.0, 131.0, 0.05235122436425982, 0.014110290941929405, 0.030827918253563156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 137.66666666666666, 134, 145, 134.0, 145.0, 145.0, 145.0, 0.03094059405940594, 0.009125058013613862, 0.019126363319925743], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1446.1724137931035, 1002, 2432, 1321.5, 2047.0, 2296.7999999999997, 2432.0, 0.2541919762987895, 304.1019750826124, 0.5019298594493675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1185.0, 147, 2338, 1224.5, 1996.0, 2301.5, 2338.0, 0.09456190258548001, 0.029550594557962506, 0.04266367089305837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.85714285714286, 126, 132, 130.0, 132.0, 132.0, 132.0, 0.07471129421307661, 0.020137028518368304, 0.04399502969773945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 129.57142857142858, 125, 134, 128.0, 134.0, 134.0, 134.0, 0.07470810476210805, 0.020136168861661936, 0.04392019440116118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 316.6470588235294, 125, 1561, 128.0, 1423.3999999999999, 1561.0, 1561.0, 0.08847070578806582, 9.386463380283523, 0.05111663366362397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 260.7647058823529, 126, 1000, 129.0, 997.6, 1000.0, 1000.0, 0.08847024537482762, 3.081415393822695, 0.051202764369909705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 147.76470588235296, 127, 384, 130.0, 200.79999999999984, 384.0, 384.0, 0.08846932456272735, 0.06574722264866749, 0.04440745393090025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e3f6dc3-c95c-4b35-ab94-b9baabd0275d", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 128.85714285714286, 126, 131, 129.0, 131.0, 131.0, 131.0, 0.0747128890406865, 0.019991534762839946, 0.042609694531016526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 158.47058823529412, 126, 381, 129.0, 380.2, 381.0, 381.0, 0.08846886416386515, 0.03930481361691941, 0.04958078118007057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 130.7142857142857, 127, 136, 130.0, 136.0, 136.0, 136.0, 0.07470890209932014, 0.05552097118904554, 0.03750036687407281], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 522.0666666666667, 128, 897, 523.0, 756.0000000000001, 897.0, 897.0, 0.08058840279158228, 0.015493330302313962, 0.054843136352891245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 137.57142857142858, 134, 143, 135.0, 143.0, 143.0, 143.0, 0.08350332223932051, 0.06572624777821517, 0.02968282157725847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2601b36f-1828-42df-a2f7-69aeb44223b4", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.7461120035046729, 1.3941114193925235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1660.7272727272725, 1112, 2918, 1447.5, 2487.6, 2854.699999999999, 2918.0, 0.0979488617897038, 0.050696188230999036, 0.04505265029585009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 263.0, 259, 268, 263.0, 268.0, 268.0, 268.0, 0.07460300543536183, 0.11562008752531173, 0.16778390773206864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c75aaaf0-160b-47be-972b-a28b5bcc60c5", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d0c7451-b09a-4fd8-8425-0d0830328215", 3, 0, 0.0, 313.6666666666667, 220, 471, 250.0, 471.0, 471.0, 471.0, 0.01607105549335462, 0.022155247400506776, 0.010305982852183789], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 1383.7017543859654, 649, 3108, 1046.0, 2321.6, 2557.1999999999975, 3108.0, 0.2640147848279504, 89.72051777004776, 0.9569812225274089], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f86a5e82-dfc2-4ee3-91f8-b1656d1b5086", 3, 0, 0.0, 346.3333333333333, 218, 473, 348.0, 473.0, 473.0, 473.0, 0.032460506383899586, 0.020868977899805238, 0.020816145044362692], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 244.62068965517244, 128, 556, 139.0, 514.2, 522.35, 556.0, 0.2552255225522552, 0.18967443619361937, 0.1233756188118812], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 822.6896551724137, 626, 1141, 765.5, 1102.3, 1129.55, 1141.0, 0.2549797994451991, 74.972527163042, 0.12823691085378666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62d4f257-051d-41fb-99e4-df3cb6724f8a", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 189.49999999999997, 127, 415, 131.5, 389.0, 396.05, 415.0, 0.2556834462601888, 0.4524398482650997, 0.12434605101325587], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1199.9999999999995, 872, 1883, 1155.5, 1533.9, 1775.9999999999998, 1883.0, 0.25480505216913785, 229.274033841296, 0.12790019220208676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 165.42105263157893, 128, 411, 136.0, 395.0, 411.0, 411.0, 0.10247559462812146, 0.07655647450245402, 0.03642687152796505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 224.2441860465117, 127, 2391, 138.0, 384.1, 480.64999999999986, 1916.5000000000066, 0.7344307094515254, 1.6657292800871069, 0.34947256159397083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 137.25, 133, 142, 137.5, 142.0, 142.0, 142.0, 0.0513083632632119, 0.03973391803488969, 0.01823851975371986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 160.33333333333334, 129, 390, 134.0, 334.40000000000015, 389.0, 390.0, 0.10852544921784159, 0.0880709456054945, 0.03857740577665463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18937b99-c27e-49ef-b6c1-9d05c71aaf62", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 327.25, 259, 514, 265.5, 514.0, 514.0, 514.0, 0.052221366372051124, 0.0809329183910597, 0.11744707690901733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 481.05882352941177, 256, 1690, 268.0, 1552.3999999999999, 1690.0, 1690.0, 0.08840905308703612, 12.564186963370048, 0.1961728224720211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d0c7451-b09a-4fd8-8425-0d0830328215", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e131a63-b7f2-4f78-aedc-143b659d3d1b", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 159.54545454545453, 129, 398, 136.0, 347.20000000000016, 398.0, 398.0, 0.07020903143449816, 0.05821041766395404, 0.02495711664273177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5a2eea2-1400-46ed-80b4-d3f5163e5fb1", 3, 0, 0.0, 407.0, 260, 633, 328.0, 633.0, 633.0, 633.0, 0.024681404207356702, 0.024753713008745442, 0.01582759319286872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 154.44444444444443, 131, 411, 135.0, 210.30000000000032, 411.0, 411.0, 0.08186357889375016, 0.06355619650442519, 0.029099944059887757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e098880-82f3-4334-bfe1-055ad0b8e325", 3, 0, 0.0, 476.0, 380, 597, 451.0, 597.0, 597.0, 597.0, 0.025353898161842383, 0.025428177160363406, 0.016258847454046058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2982573-ae00-46ef-a75a-f3736e6be9ee", 3, 0, 0.0, 450.6666666666667, 231, 594, 527.0, 594.0, 594.0, 594.0, 0.03786826891520033, 0.024345648146979378, 0.024284013594708543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 131.26315789473688, 127, 147, 129.0, 139.0, 147.0, 147.0, 0.10263169266669547, 0.07627218566343287, 0.05151629885808738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 183.63157894736844, 126, 391, 129.0, 384.0, 391.0, 391.0, 0.10264278151133394, 0.03557889178209478, 0.058084756601551525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 180.47368421052627, 125, 1125, 128.0, 131.0, 1125.0, 1125.0, 0.10264333601646616, 4.887191301855143, 0.0598787964528624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 202.89473684210526, 126, 1011, 129.0, 395.0, 1011.0, 1011.0, 0.10264444504470435, 1.6146768894681398, 0.05997968213986656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad321874-6fcb-4efd-ab22-18351650946a", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b926ec29-8e39-460f-bcef-239f16c2745e", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.0, 0.6019563581640331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22573363431151242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.1504890895410083], "isController": false}, {"data": ["401/Unauthorized", 19, 59.375, 1.4296463506395787], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 32, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

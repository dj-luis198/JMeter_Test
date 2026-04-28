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

    var data = {"OkPercent": 96.84055841293167, "KoPercent": 3.159441587068332};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.800252047889099, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b63347d5-a77d-4b8e-bad6-5760850c849f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9ea17f9-f5ba-4191-9380-88ab807b16de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3942a25-abe7-46a4-9148-b4a571740c13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9ea17f9-f5ba-4191-9380-88ab807b16de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15c185ec-51fa-4404-a5d2-8274e4b20a4b"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b63347d5-a77d-4b8e-bad6-5760850c849f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef511f93-e111-43e9-9fea-c86cee6a3200"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15c185ec-51fa-4404-a5d2-8274e4b20a4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2f74753c-0187-4911-bd42-e780639cc6bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef511f93-e111-43e9-9fea-c86cee6a3200"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f74753c-0187-4911-bd42-e780639cc6bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/293ae4b7-4209-4669-af90-7fbb99a13d45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3942a25-abe7-46a4-9148-b4a571740c13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9088397790055248, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=293ae4b7-4209-4669-af90-7fbb99a13d45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6afd4eab-65d1-4a57-8a2a-941e44e70a1f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bf5819a1-8538-4749-a2a5-cc58f075108a"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62bb5f28-65ca-4f37-a49d-1e33ed27087a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf5819a1-8538-4749-a2a5-cc58f075108a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2675c8eb-cdc0-4eb3-ab78-89c7b7106003"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/152b22fd-9df7-4140-a4dd-d4d7aeff7060"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2675c8eb-cdc0-4eb3-ab78-89c7b7106003"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=375e2845-a8f9-47c3-8c95-11b1aba659fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62bb5f28-65ca-4f37-a49d-1e33ed27087a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/375e2845-a8f9-47c3-8c95-11b1aba659fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 43, 3.159441587068332, 290.0, 76, 2348, 90.0, 793.3999999999999, 1013.7999999999997, 1409.879999999997, 5.393538057930007, 743.084865962802, 3.9560226087227894], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1335.8771929824557, 973, 1813, 1341.0, 1608.8, 1664.1, 1813.0, 0.2513227513227513, 302.42652960345015, 1.2357520047949735], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 257.0, 161, 1012, 167.0, 472.0, 1012.0, 1012.0, 0.12866700977869275, 8.290517516489693, 0.2876424542724219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 104.21428571428572, 81, 343, 84.5, 225.0, 343.0, 343.0, 0.078154220607035, 0.0606763724439383, 0.02778138310640697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 243.94444444444446, 159, 484, 177.5, 340.9000000000002, 484.0, 484.0, 0.08586229595779392, 0.1330697887549013, 0.19310631600664002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 97.6, 79, 248, 81.0, 231.60000000000005, 248.0, 248.0, 0.0697495989398061, 0.05183539530585199, 0.03501102915533236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b63347d5-a77d-4b8e-bad6-5760850c849f", 1, 0, 0.0, 1273.0, 1273, 1273, 1273.0, 1273.0, 1273.0, 1273.0, 0.7855459544383347, 0.14191992340926946, 0.5415971131186175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 127.0, 78, 240, 79.5, 239.8, 240.0, 240.0, 0.06975057195469003, 0.01866372726131354, 0.03977962306790916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9ea17f9-f5ba-4191-9380-88ab807b16de", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 110.9, 79, 234, 81.0, 233.8, 234.0, 234.0, 0.06975008544385466, 0.018799827717288952, 0.041005421325391124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3942a25-abe7-46a4-9148-b4a571740c13", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 126.29999999999998, 78, 239, 79.0, 238.8, 239.0, 239.0, 0.06967475822858894, 0.018779524678799363, 0.04102917891781165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 83.8, 80, 91, 82.0, 91.0, 91.0, 91.0, 0.06419144456426848, 0.018931461189852616, 0.03968084414959174], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 906.2982456140352, 621, 1469, 808.0, 1263.8, 1330.8999999999999, 1469.0, 0.2602347591458821, 311.33124417895937, 0.5138619951103258], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 495.18749999999994, 81, 1374, 444.0, 1087.7000000000003, 1374.0, 1374.0, 0.0816205765473476, 0.01766021385866377, 0.05425596308454361], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 495.18749999999994, 81, 1374, 444.0, 1087.7000000000003, 1374.0, 1374.0, 0.08180502794152986, 0.01770012353837423, 0.05437857417670909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 858.217391304348, 150, 2030, 900.0, 1476.4000000000003, 1935.1999999999987, 2030.0, 0.09232646638513785, 0.028663855392668473, 0.041655104951107115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 136.00000000000003, 77, 253, 81.0, 240.2, 253.0, 253.0, 0.14497079264912804, 0.051599209056410696, 0.08196246215835927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 80.0, 78, 83, 79.5, 83.0, 83.0, 83.0, 0.028645087367516472, 0.0077207462045259245, 0.016868152033801206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 102.76470588235294, 79, 292, 81.0, 249.59999999999997, 292.0, 292.0, 0.14515770958211657, 0.10787599315624093, 0.07286236594258585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 80.5, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.02864549764390782, 0.007720856786834529, 0.016840419513312995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 121.6470588235294, 78, 464, 81.0, 285.59999999999985, 464.0, 464.0, 0.1449683201582713, 2.5441573769687977, 0.08463425079093011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9ea17f9-f5ba-4191-9380-88ab807b16de", 3, 0, 0.0, 368.3333333333333, 201, 465, 439.0, 465.0, 465.0, 465.0, 0.016617092341182138, 0.022908003276336707, 0.010656143200562766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15c185ec-51fa-4404-a5d2-8274e4b20a4b", 3, 0, 0.0, 408.6666666666667, 321, 455, 450.0, 455.0, 455.0, 455.0, 0.02317085415492033, 0.02738716518115746, 0.014858913634502945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 177.05882352941177, 77, 953, 81.0, 381.7999999999995, 953.0, 953.0, 0.1451614280468957, 7.720148045977747, 0.08460523029433614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b63347d5-a77d-4b8e-bad6-5760850c849f", 3, 0, 0.0, 680.3333333333333, 165, 1347, 529.0, 1347.0, 1347.0, 1347.0, 0.13288447909284196, 0.060126766256201274, 0.0852156327515946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 113.35714285714288, 78, 241, 80.0, 238.0, 241.0, 241.0, 0.07774883793254732, 0.020955741474006896, 0.045707812925188954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef511f93-e111-43e9-9fea-c86cee6a3200", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15c185ec-51fa-4404-a5d2-8274e4b20a4b", 1, 0, 0.0, 1857.0, 1857, 1857, 1857.0, 1857.0, 1857.0, 1857.0, 0.5385029617662898, 0.09728813274098008, 0.37127254981152397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 113.21428571428571, 77, 237, 81.0, 236.0, 237.0, 237.0, 0.07781625359205385, 0.020973912100983264, 0.04582343839453952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 81.07142857142857, 79, 84, 80.5, 83.5, 84.0, 84.0, 0.0778140910202539, 0.05782863600235666, 0.03905902615665088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 118.0, 77, 235, 80.0, 235.0, 235.0, 235.0, 0.0286135313389702, 0.007656355065310385, 0.01631865459175644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 113.64285714285715, 78, 249, 80.0, 242.0, 249.0, 249.0, 0.07775056507999978, 0.020804350421796815, 0.04434211914718738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 80.75, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.028645292504243084, 0.021288151948954087, 0.01437859408904389], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 497.71428571428567, 79, 1347, 449.5, 1073.5, 1347.0, 1347.0, 0.07243302532051614, 0.0144350692899494, 0.0492873996931944], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 88.75, 82, 105, 84.0, 105.0, 105.0, 105.0, 0.028531077476140886, 0.02245707856032183, 0.010141906446596955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1418.3333333333333, 766, 2348, 1274.0, 1974.8000000000002, 2312.9999999999995, 2348.0, 0.09669799374686308, 0.05004876629476312, 0.04447729985817628], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 173.8235294117647, 79, 455, 174.0, 284.59999999999985, 455.0, 455.0, 0.08474618517539968, 0.14086229710766257, 0.05476274339602889], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f74753c-0187-4911-bd42-e780639cc6bf", 3, 0, 0.0, 695.6666666666666, 185, 1224, 678.0, 1224.0, 1224.0, 1224.0, 0.01980067322288958, 0.02340372541416408, 0.012697697346709788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 201.75, 161, 318, 164.0, 318.0, 318.0, 318.0, 0.028596961572832886, 0.04431970509383378, 0.06431523681858803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef511f93-e111-43e9-9fea-c86cee6a3200", 3, 0, 0.0, 415.33333333333337, 204, 800, 242.0, 800.0, 800.0, 800.0, 0.042013276195277706, 0.027010488439346832, 0.02694210745595608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 88.94736842105263, 78, 232, 80.0, 86.0, 232.0, 232.0, 0.1287384982315396, 0.09567382534590001, 0.06462069149512825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 96.57894736842105, 78, 242, 80.0, 235.0, 242.0, 242.0, 0.1287376259426643, 0.04462410307140873, 0.07285162734522689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 529.625, 389, 657, 540.0, 657.0, 657.0, 657.0, 0.05428181762666323, 15.960656708214875, 0.030957599115206375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 867.5, 692, 1075, 931.0, 1075.0, 1075.0, 1075.0, 0.05411035807529456, 48.68859531201385, 0.030806971443258526], "isController": false}, {"data": ["addBook", 62, 16, 25.806451612903224, 808.4354838709678, 405, 1613, 671.5, 1488.9, 1531.6499999999999, 1613.0, 0.29140678977820184, 74.24173647308483, 1.0619493527949202], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 199.0, 79, 247, 235.0, 247.0, 247.0, 247.0, 0.054364815091672666, 0.0962002392051864, 0.030102392731424222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 97.3157894736842, 78, 238, 80.0, 235.0, 238.0, 238.0, 0.10604098763227218, 0.07880585116031165, 0.053227605120105374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 112.0, 77, 236, 80.0, 234.0, 236.0, 236.0, 0.10604039580973004, 0.03675660101463916, 0.06000744026856126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 166.21052631578945, 76, 956, 80.0, 236.0, 956.0, 956.0, 0.10594815231998572, 5.044544619855241, 0.06180671920393904], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 140.8947368421053, 78, 414, 83.0, 321.6, 326.59999999999997, 414.0, 0.2608994164092001, 0.19389107020254034, 0.1261183702368692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 136.47368421052633, 78, 698, 80.0, 235.0, 698.0, 698.0, 0.1060415794614204, 1.6681164538858657, 0.0619647778010325], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 500.71929824561386, 382, 723, 468.0, 657.0000000000001, 703.0999999999999, 723.0, 0.2608552390715384, 76.70010149614208, 0.1311918438689866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 81.37500000000001, 80, 85, 80.5, 85.0, 85.0, 85.0, 0.05442361985101534, 0.04044567842443621, 0.03056013809993537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f74753c-0187-4911-bd42-e780639cc6bf", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 102.98245614035088, 78, 336, 81.0, 236.2, 238.0, 336.0, 0.2612306253952832, 0.4622557550939972, 0.12704380024106546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 567.6111111111109, 79, 1080, 805.0, 1043.1000000000001, 1080.0, 1080.0, 0.09738731476121172, 48.69459786140162, 0.05260352136298957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 165.47368421052633, 77, 933, 80.0, 240.0, 933.0, 933.0, 0.12873937053223566, 6.129710474048853, 0.07510237744350713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/293ae4b7-4209-4669-af90-7fbb99a13d45", 3, 0, 0.0, 290.0, 178, 424, 268.0, 424.0, 424.0, 424.0, 0.07530876594035546, 0.03407525542223115, 0.04829370732503264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3942a25-abe7-46a4-9148-b4a571740c13", 3, 0, 0.0, 299.3333333333333, 216, 459, 223.0, 459.0, 459.0, 459.0, 0.06110104075439419, 0.03928208186521111, 0.03918263355669158], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 762.5789473684209, 541, 1109, 720.0, 1002.2, 1007.5999999999999, 1109.0, 0.2606631820114966, 234.54518937094429, 0.13084069878311452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.0, 80, 246, 84.5, 121.8000000000002, 246.0, 246.0, 0.0885247352864513, 0.06613420165442895, 0.03146777699635573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 386.33333333333337, 78, 707, 463.5, 656.6000000000001, 707.0, 707.0, 0.0973883685825123, 15.92022962689434, 0.05269919641069757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 108.6842105263158, 77, 464, 81.0, 238.0, 464.0, 464.0, 0.12874024284475283, 2.0251840689031333, 0.07522860921576864], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 519.5000000000002, 80, 1857, 399.0, 1448.2000000000005, 1857.0, 1857.0, 0.08194748190753251, 0.017730946250134445, 0.05467333524970934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 16, 8.839779005524862, 137.76795580110502, 78, 965, 86.0, 255.4000000000001, 326.0, 561.5600000000034, 0.7598369499053352, 1.6093158345192666, 0.36543047544383295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 84.5, 82, 90, 83.5, 89.8, 90.0, 90.0, 0.07080999553897027, 0.05483625631094085, 0.02517074060174334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 281.84210526315786, 159, 1037, 168.0, 472.0, 1037.0, 1037.0, 0.10590091019045443, 6.823608883553589, 0.2367475374554798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=293ae4b7-4209-4669-af90-7fbb99a13d45", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 85.11764705882354, 80, 99, 83.0, 98.2, 99.0, 99.0, 0.14805138253864575, 0.12014716688438928, 0.05262763988678423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6afd4eab-65d1-4a57-8a2a-941e44e70a1f", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf5819a1-8538-4749-a2a5-cc58f075108a", 3, 0, 0.0, 648.3333333333334, 174, 1025, 746.0, 1025.0, 1025.0, 1025.0, 0.021049086469647215, 0.024879307607841485, 0.013498274851954758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 505.47619047619054, 140, 1371, 400.0, 1003.0, 1334.8999999999994, 1371.0, 0.09701830412004397, 0.05959425126123795, 0.0438666746167777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 98.83333333333333, 78, 250, 80.5, 239.20000000000002, 250.0, 250.0, 0.09738731476121172, 0.07237475247390832, 0.04888386697974885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 124.66666666666667, 77, 246, 80.0, 246.0, 246.0, 246.0, 0.09738889550171512, 0.10732222468700292, 0.050998134732126436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62bb5f28-65ca-4f37-a49d-1e33ed27087a", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.25920238522238165, 0.9891723457675754], "isController": false}, {"data": ["login", 21, 0, 0.0, 2584.428571428572, 1536, 3408, 2667.0, 3302.4, 3399.5, 3408.0, 0.09501273623107097, 43.428517266868155, 0.20337338336960406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf5819a1-8538-4749-a2a5-cc58f075108a", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 256.5, 161, 485, 239.5, 468.6, 485.0, 485.0, 0.06963545837540475, 0.10792135980641343, 0.156611777967341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 93.99999999999999, 81, 238, 84.0, 101.0, 238.0, 238.0, 0.12433334423976702, 0.10065658435035828, 0.04419661846022969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 230.14285714285714, 161, 330, 165.5, 325.0, 330.0, 330.0, 0.07771215418091389, 0.12043866082530309, 0.17477645613148898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 87.05263157894737, 81, 99, 85.0, 99.0, 99.0, 99.0, 0.10732583558811734, 0.08898401798272619, 0.038150980619213584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 677.1111111111111, 159, 1162, 885.0, 1126.9, 1162.0, 1162.0, 0.09734518060235034, 64.76631748589847, 0.20509454988670103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.27777777777777, 81, 269, 84.5, 116.90000000000023, 269.0, 269.0, 0.09351718118434314, 0.0726036709390164, 0.033242435499121974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2675c8eb-cdc0-4eb3-ab78-89c7b7106003", 3, 0, 0.0, 257.6666666666667, 161, 449, 163.0, 449.0, 449.0, 449.0, 0.07111869710546903, 0.03217935839082095, 0.045606716568285806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/152b22fd-9df7-4140-a4dd-d4d7aeff7060", 2, 0, 0.0, 178.0, 167, 189, 178.0, 189.0, 189.0, 189.0, 0.01682977523835169, 0.03326510261955452, 0.010461085878135597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 310.1764705882353, 161, 1033, 314.0, 643.3999999999996, 1033.0, 1033.0, 0.14486578610992756, 10.406003674904133, 0.32362623828291437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 515.75, 79, 1156, 435.5, 1079.0, 1156.0, 1156.0, 0.0980169936962821, 58.64431394230475, 0.14277194546885816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2675c8eb-cdc0-4eb3-ab78-89c7b7106003", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.038299209770115, 3.9623742816091956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=375e2845-a8f9-47c3-8c95-11b1aba659fb", 1, 0, 0.0, 996.0, 996, 996, 996.0, 996.0, 996.0, 996.0, 1.004016064257028, 0.18138962098393574, 0.6922220130522089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62bb5f28-65ca-4f37-a49d-1e33ed27087a", 3, 0, 0.0, 579.0, 169, 1169, 399.0, 1169.0, 1169.0, 1169.0, 0.02201754064071043, 0.030352957230927305, 0.01411932130930975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 91.55555555555557, 79, 248, 80.5, 111.20000000000022, 248.0, 248.0, 0.08589630407291642, 0.06383504628856386, 0.043115918255350626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 114.6666666666667, 78, 241, 80.0, 236.5, 241.0, 241.0, 0.08589753378636329, 0.02298430103267924, 0.048988437237535314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/375e2845-a8f9-47c3-8c95-11b1aba659fb", 3, 0, 0.0, 308.3333333333333, 185, 539, 201.0, 539.0, 539.0, 539.0, 0.05330111577002345, 0.03457979288074764, 0.03418072853741738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 114.61111111111111, 78, 237, 81.0, 236.1, 237.0, 237.0, 0.08589589417625838, 0.02315162772719464, 0.05049739091221439], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 858.217391304348, 150, 2030, 900.0, 1476.4000000000003, 1935.1999999999987, 2030.0, 0.09371994849477613, 0.029096478574804817, 0.042283804887291575], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 133.44444444444446, 78, 245, 82.5, 241.4, 245.0, 245.0, 0.08589794369867002, 0.023152180137532154, 0.05058248051786916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6612784717119765], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.627906976744185, 0.36737692872887584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.2204261572373255], "isController": false}, {"data": ["401/Unauthorized", 26, 60.46511627906977, 1.9103600293901544], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 43, "401/Unauthorized", 26, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

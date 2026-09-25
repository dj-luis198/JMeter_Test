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

    var data = {"OkPercent": 96.98113207547169, "KoPercent": 3.018867924528302};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7646868947708199, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab5b57ed-bf1f-4185-9e05-6c91b3a843b3"], "isController": false}, {"data": [0.16379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f5d1adc-22f0-4ec0-81d1-f15bac3e0f70"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b93f0700-ef89-4155-9d1c-dd5e4cdf0ad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a838c8a-94f2-40e3-b710-cc89bd29cf06"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b4877f67-6547-42dd-b5f6-6ae586427117"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ae1cc34-b738-4d88-adb5-e0436bb15d1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55322ea0-dd3f-40e7-a2c4-75a2937f1f6a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbafe0c7-b4de-45e5-b48d-ccec3630839e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46dc66b5-377d-42a6-82c5-f0ad74f89295"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/622d705c-0528-47a5-ad3f-a457b5a23c0e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6fd9686-42da-40f2-8f62-a8656ad9a2a8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb12c2f9-a1a3-4e88-bd4c-27f9835ff27c"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8af72354-e487-41eb-a55c-1c6efd2dc688"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b93f0700-ef89-4155-9d1c-dd5e4cdf0ad1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4877f67-6547-42dd-b5f6-6ae586427117"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a838c8a-94f2-40e3-b710-cc89bd29cf06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c56b2907-cd9f-4909-9364-feaacf2d8998"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5948275862068966, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f5d1adc-22f0-4ec0-81d1-f15bac3e0f70"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ae1cc34-b738-4d88-adb5-e0436bb15d1f"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab5b57ed-bf1f-4185-9e05-6c91b3a843b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8af72354-e487-41eb-a55c-1c6efd2dc688"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55322ea0-dd3f-40e7-a2c4-75a2937f1f6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46dc66b5-377d-42a6-82c5-f0ad74f89295"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb12c2f9-a1a3-4e88-bd4c-27f9835ff27c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40125dab-992f-404e-b30b-da180a147e3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6fd9686-42da-40f2-8f62-a8656ad9a2a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbafe0c7-b4de-45e5-b48d-ccec3630839e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 40, 3.018867924528302, 353.9267924528299, 89, 2293, 109.0, 1023.2000000000003, 1221.4, 1592.6800000000003, 5.1962006949183115, 754.0495935995062, 3.8009128094680658], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab5b57ed-bf1f-4185-9e05-6c91b3a843b3", 1, 0, 0.0, 1120.0, 1120, 1120, 1120.0, 1120.0, 1120.0, 1120.0, 0.8928571428571428, 0.16130719866071427, 0.6155831473214285], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1620.4482758620693, 1149, 2146, 1619.5, 1998.7, 2127.35, 2146.0, 0.2646830648473509, 318.50193538795463, 1.3014445620179802], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3f5d1adc-22f0-4ec0-81d1-f15bac3e0f70", 3, 0, 0.0, 708.0, 193, 1043, 888.0, 1043.0, 1043.0, 1043.0, 0.03326274240223526, 0.02772977971748844, 0.021330599782683417], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 550.8125, 105, 1112, 645.5, 974.1000000000001, 1112.0, 1112.0, 0.08803979398688208, 0.018420435411806137, 0.058786337049346306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 550.8125, 105, 1112, 645.5, 974.1000000000001, 1112.0, 1112.0, 0.08933207523994037, 0.01869081750015354, 0.059649225044247293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b93f0700-ef89-4155-9d1c-dd5e4cdf0ad1", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 148.94444444444443, 92, 295, 99.5, 293.2, 295.0, 295.0, 0.11180679785330948, 0.04857578326873385, 0.06272147839644206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 101.44444444444446, 94, 109, 102.0, 108.1, 109.0, 109.0, 0.11180471443212522, 0.08308924578403055, 0.05612072579893786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a838c8a-94f2-40e3-b710-cc89bd29cf06", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 0.17059873701605288, 0.6510416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 214.83333333333334, 91, 775, 101.0, 720.1000000000001, 775.0, 775.0, 0.11181304858276961, 3.679760634663287, 0.06477537612667175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 222.16666666666669, 94, 1120, 100.0, 927.4000000000003, 1120.0, 1120.0, 0.1118102703945039, 11.20535208200041, 0.0646645769534186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4877f67-6547-42dd-b5f6-6ae586427117", 3, 0, 0.0, 337.0, 203, 562, 246.0, 562.0, 562.0, 562.0, 0.03045159718627242, 0.025386243617852758, 0.01952787970604058], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 226.6470588235294, 97, 483, 203.0, 398.19999999999993, 483.0, 483.0, 0.08883779264214046, 0.13108269426734948, 0.05741183175689799], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 109.0, 91, 300, 98.0, 142.39999999999986, 300.0, 300.0, 0.081251852064275, 0.06038345646573562, 0.040784621055700535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 96.82352941176471, 89, 115, 97.0, 104.6, 115.0, 115.0, 0.08125068704625076, 0.021740906494797565, 0.04633828245606488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 725.375, 585, 888, 763.0, 888.0, 888.0, 888.0, 0.080705364889131, 23.7300569477231, 0.046027278413332526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 997.75, 623, 1336, 978.0, 1336.0, 1336.0, 1336.0, 0.0806736247668028, 72.5902693742752, 0.04593039378813089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 224.12499999999997, 94, 308, 296.5, 308.0, 308.0, 308.0, 0.08118448158634477, 0.14365847718208666, 0.04495273540962645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 98.125, 94, 105, 96.0, 105.0, 105.0, 105.0, 0.04740291290899826, 0.03522814133178484, 0.02379404026877452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 119.0, 90, 282, 95.5, 282.0, 282.0, 282.0, 0.04740572187062978, 0.01268473417241461, 0.02703607575434355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 119.375, 93, 288, 94.5, 288.0, 288.0, 288.0, 0.04735128736312519, 0.012762651672092337, 0.02783737792246227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 122.125, 90, 305, 94.5, 305.0, 305.0, 305.0, 0.04740684554849721, 0.012777626339243385, 0.02791633580639044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 145.375, 90, 299, 97.5, 299.0, 299.0, 299.0, 0.0813578627289461, 0.06046223978196093, 0.04568434674721095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 625.7894736842104, 96, 1320, 872.0, 1265.0, 1320.0, 1320.0, 0.10894370477402783, 51.60745495679522, 0.059119430253093436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 106.41176470588235, 92, 274, 95.0, 136.39999999999986, 274.0, 274.0, 0.08125224041104073, 0.021900017923288325, 0.047767430397897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 429.73684210526307, 92, 879, 545.0, 855.0, 879.0, 879.0, 0.10894370477402783, 16.873417807708627, 0.05922582058978682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 120.64705882352939, 92, 294, 100.0, 290.8, 294.0, 294.0, 0.08124952206163494, 0.02189928524317504, 0.047845177542154164], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 596.9375000000001, 101, 1317, 592.0, 1179.1000000000001, 1317.0, 1317.0, 0.08973488948587517, 0.01877509772690308, 0.06026872094131899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ae1cc34-b738-4d88-adb5-e0436bb15d1f", 3, 0, 0.0, 326.0, 192, 572, 214.0, 572.0, 572.0, 572.0, 0.02698909640505236, 0.027068166023426533, 0.01730746091079204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 246.75, 188, 404, 203.5, 404.0, 404.0, 404.0, 0.047321877495489634, 0.07333966756381059, 0.10642801159385998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 655.1304347826087, 182, 1193, 644.0, 1145.0, 1187.8, 1193.0, 0.1113327008345112, 0.06838698127432377, 0.05033890672497919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 98.94736842105264, 92, 118, 98.0, 106.0, 118.0, 118.0, 0.10894932709455081, 0.0809672245302277, 0.054687455201756954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 161.21052631578948, 91, 307, 103.0, 305.0, 307.0, 307.0, 0.10894745292323219, 0.11527509590242896, 0.05731836596022845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55322ea0-dd3f-40e7-a2c4-75a2937f1f6a", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["login", 23, 0, 0.0, 2643.347826086957, 1669, 3804, 2665.0, 3528.8, 3750.7999999999993, 3804.0, 0.10704694706761178, 44.68792796962194, 0.2232523349615329], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 105.05882352941177, 95, 132, 104.0, 115.19999999999999, 132.0, 132.0, 0.08161932745674176, 0.06607658443519426, 0.029013120306888674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbafe0c7-b4de-45e5-b48d-ccec3630839e", 3, 0, 0.0, 355.6666666666667, 192, 498, 377.0, 498.0, 498.0, 498.0, 0.028655210950111278, 0.023888670326573887, 0.018375900251210685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46dc66b5-377d-42a6-82c5-f0ad74f89295", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/622d705c-0528-47a5-ad3f-a457b5a23c0e", 2, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 0.02225634862344484, 0.02532094350225902, 0.013834146385568985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6fd9686-42da-40f2-8f62-a8656ad9a2a8", 3, 0, 0.0, 501.66666666666663, 355, 773, 377.0, 773.0, 773.0, 773.0, 0.04827109044393313, 0.031033660034755186, 0.030955093806819097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb12c2f9-a1a3-4e88-bd4c-27f9835ff27c", 1, 0, 0.0, 964.0, 964, 964, 964.0, 964.0, 964.0, 964.0, 1.037344398340249, 0.18741085321576764, 0.7152003371369294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 727.3157894736844, 192, 1439, 973.0, 1361.0, 1439.0, 1439.0, 0.10888564142239032, 68.64050433930771, 0.23022351106048883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8af72354-e487-41eb-a55c-1c6efd2dc688", 3, 0, 0.0, 342.0, 273, 443, 310.0, 443.0, 443.0, 443.0, 0.034727849420044914, 0.028951179155187183, 0.02227013781168245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 390.55555555555554, 200, 1217, 374.5, 1036.1000000000004, 1217.0, 1217.0, 0.11173392428164397, 15.006438279421713, 0.24811575091404556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 656.5333333333333, 97, 1435, 717.0, 1346.2, 1435.0, 1435.0, 0.1153997061154151, 73.64543284025603, 0.1743316914519591], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1099.9583333333337, 136, 1925, 1173.0, 1715.0, 1884.25, 1925.0, 0.0998863792436104, 0.031214493513628247, 0.04506592501030078], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 233.1764705882353, 187, 591, 200.0, 426.9999999999999, 591.0, 591.0, 0.08121187222028481, 0.12586254024764842, 0.1826474040266757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 105.11764705882354, 96, 123, 104.0, 119.0, 123.0, 123.0, 0.12627481857279743, 0.0980356257474355, 0.044886751914549085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93f0700-ef89-4155-9d1c-dd5e4cdf0ad1", 3, 0, 0.0, 299.0, 190, 498, 209.0, 498.0, 498.0, 498.0, 0.027557572361592092, 0.02747683728631399, 0.01767201092198451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 339.63157894736844, 194, 1136, 204.0, 930.0, 1136.0, 1136.0, 0.1428206323195574, 18.18363720693582, 0.3173604233692139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 99.25, 94, 105, 99.0, 105.0, 105.0, 105.0, 0.04351042074576861, 0.03233538104250968, 0.021840191663403386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 96.875, 91, 104, 95.5, 104.0, 104.0, 104.0, 0.04351042074576861, 0.011642436801113867, 0.02481453683157116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 117.875, 91, 281, 94.0, 281.0, 281.0, 281.0, 0.04351255065132849, 0.011727992167740883, 0.025580620597753664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 124.75, 94, 309, 99.5, 309.0, 309.0, 309.0, 0.04351018410246648, 0.011727354308867918, 0.02562171974002665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 104.75, 101, 112, 103.0, 112.0, 112.0, 112.0, 0.05264889766370516, 0.015527311615663049, 0.03254565646594275], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1141.3620689655177, 748, 1734, 1137.5, 1602.0, 1680.6999999999998, 1734.0, 0.27237463722515987, 325.85475886626404, 0.5378335121770247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1099.9583333333337, 136, 1925, 1173.0, 1715.0, 1884.25, 1925.0, 0.09728848874493796, 0.030402652732793113, 0.043893829882970054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 124.42857142857143, 91, 289, 99.0, 289.0, 289.0, 289.0, 0.03455015695642731, 0.00931234699216205, 0.02034545375461491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 154.57142857142858, 93, 305, 95.0, 305.0, 305.0, 305.0, 0.034549133803859634, 0.00931207122057154, 0.020311111865159666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4877f67-6547-42dd-b5f6-6ae586427117", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 142.8235294117647, 91, 300, 98.0, 298.4, 300.0, 300.0, 0.13041910563180384, 0.03515202456482214, 0.0766721695218222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 147.1764705882353, 90, 399, 99.0, 315.79999999999995, 399.0, 399.0, 0.1306175135035459, 0.0352055016865026, 0.07691636781507633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 123.14285714285712, 90, 291, 94.0, 291.0, 291.0, 291.0, 0.03458344243586007, 0.00925377268303287, 0.019723369514201443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 98.70588235294117, 92, 104, 99.0, 103.2, 104.0, 104.0, 0.1306215279645324, 0.09707322537207927, 0.06556588415407194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 121.85714285714286, 91, 273, 97.0, 273.0, 273.0, 273.0, 0.034582759012514015, 0.025700663680198403, 0.017358923957453323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 122.70588235294115, 92, 304, 100.0, 295.2, 304.0, 304.0, 0.1304241085128583, 0.03489863841066716, 0.07438249938623949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.57142857142857, 101, 133, 104.0, 133.0, 133.0, 133.0, 0.03367926752404459, 0.026509267211308536, 0.011971927127687727], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 497.59999999999997, 99, 888, 498.0, 831.6, 888.0, 888.0, 0.08692326414241508, 0.01721488082820486, 0.059148564896909006], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1375.1739130434783, 809, 2293, 1294.0, 2054.4, 2251.5999999999995, 2293.0, 0.10886594815140886, 0.05634663332055342, 0.050074083573548415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 280.2857142857143, 193, 579, 200.0, 579.0, 579.0, 579.0, 0.03453226053110617, 0.05351825924107958, 0.07766386328431396], "isController": false}, {"data": ["addBook", 55, 17, 30.90909090909091, 962.2545454545455, 480, 1921, 804.0, 1619.4, 1756.1999999999998, 1921.0, 0.26521873312244426, 81.87879161070953, 0.9619312037675526], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a838c8a-94f2-40e3-b710-cc89bd29cf06", 3, 0, 0.0, 459.3333333333333, 347, 672, 359.0, 672.0, 672.0, 672.0, 0.047075807742401186, 0.029836132055486686, 0.03018858764730805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c56b2907-cd9f-4909-9364-feaacf2d8998", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 178.91379310344826, 94, 420, 103.0, 398.3, 414.15, 420.0, 0.2739221399931047, 0.20356909036596943, 0.13241353446932308], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 642.0344827586205, 450, 882, 597.0, 831.0, 857.0, 882.0, 0.27374243668526227, 80.48936548981018, 0.1376731981376075], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 158.37931034482753, 90, 390, 101.0, 304.1, 306.29999999999995, 390.0, 0.2741526084675342, 0.48512160795231635, 0.133328124039875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f5d1adc-22f0-4ec0-81d1-f15bac3e0f70", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 960.0689655172413, 647, 1448, 973.0, 1222.2, 1323.6499999999996, 1448.0, 0.2729553059217183, 245.6056640726108, 0.1370107687927375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 103.21052631578947, 97, 116, 102.0, 111.0, 116.0, 116.0, 0.14154808910079714, 0.10574637515831037, 0.050315922297548984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ae1cc34-b738-4d88-adb5-e0436bb15d1f", 1, 0, 0.0, 1317.0, 1317, 1317, 1317.0, 1317.0, 1317.0, 1317.0, 0.7593014426727411, 0.13717848329536828, 0.5235027524677297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, 10.119047619047619, 148.70833333333326, 92, 1115, 105.0, 282.0, 352.9499999999995, 663.7400000000015, 0.7195970256656272, 1.6863923948124764, 0.3401554950656204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.25000000000003, 97, 305, 106.0, 305.0, 305.0, 305.0, 0.04336043360433604, 0.033578929539295393, 0.015413279132791328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab5b57ed-bf1f-4185-9e05-6c91b3a843b3", 3, 0, 0.0, 367.6666666666667, 206, 483, 414.0, 483.0, 483.0, 483.0, 0.043794981095166496, 0.028155953015284445, 0.028084672121574866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 139.55555555555554, 95, 309, 104.5, 306.3, 309.0, 309.0, 0.113362975652152, 0.0919967116864632, 0.04029699525135091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8af72354-e487-41eb-a55c-1c6efd2dc688", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 0.1781696868836292, 0.6799340483234714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55322ea0-dd3f-40e7-a2c4-75a2937f1f6a", 3, 0, 0.0, 404.0, 264, 625, 323.0, 625.0, 625.0, 625.0, 0.044427331694458436, 0.02856249352101413, 0.028490183410834348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 225.375, 189, 408, 202.0, 408.0, 408.0, 408.0, 0.043486532764384536, 0.06739563232136547, 0.09780223140271246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46dc66b5-377d-42a6-82c5-f0ad74f89295", 3, 0, 0.0, 273.0, 189, 425, 205.0, 425.0, 425.0, 425.0, 0.1072041166380789, 0.04850707100485992, 0.06874743156803888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 275.1176470588235, 188, 502, 204.0, 423.5999999999999, 502.0, 502.0, 0.1303221256305291, 0.20197384118715792, 0.29309751496787945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb12c2f9-a1a3-4e88-bd4c-27f9835ff27c", 3, 0, 0.0, 448.0, 237, 794, 313.0, 794.0, 794.0, 794.0, 0.02404906008256844, 0.024119516313279087, 0.015422086055553329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 180.99999999999997, 97, 325, 116.5, 325.0, 325.0, 325.0, 0.04646138478157341, 0.038521206718316235, 0.016515570371574924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 134.68421052631578, 92, 306, 104.0, 298.0, 306.0, 306.0, 0.10630322154710352, 0.08253033313471415, 0.03778747328432195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40125dab-992f-404e-b30b-da180a147e3d", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6fd9686-42da-40f2-8f62-a8656ad9a2a8", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 101.0, 92, 119, 100.0, 109.0, 119.0, 119.0, 0.14292914475713328, 0.10621980386736175, 0.07174373086442043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 117.84210526315788, 91, 291, 99.0, 281.0, 291.0, 291.0, 0.1429431236834186, 0.060847807891965096, 0.08025856718326814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 205.0526315789474, 93, 1032, 98.0, 810.0, 1032.0, 1032.0, 0.1429441990986992, 13.573571474920815, 0.08274247379983297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 190.26315789473685, 92, 755, 99.0, 607.0, 755.0, 755.0, 0.1429377468497273, 4.458517491066391, 0.08287832659394395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbafe0c7-b4de-45e5-b48d-ccec3630839e", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.0, 0.6037735849056604], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.3018867924528302], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.5, 0.22641509433962265], "isController": false}, {"data": ["401/Unauthorized", 25, 62.5, 1.8867924528301887], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 40, "401/Unauthorized", 25, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

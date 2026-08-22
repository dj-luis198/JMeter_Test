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

    var data = {"OkPercent": 97.26815240833932, "KoPercent": 2.7318475916606757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7945712523133868, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36885245901639346, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5741769-7b99-4319-a878-fcb0a61b97eb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8837b00d-df1b-4bee-935f-69d54f0825b7"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8729dc8-9847-4dd7-b8dc-1636f0cdc2f6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a8998ef-52b8-4aee-9d51-7530e9eda7ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bfc7177-71b3-4917-b6bf-aab53486e377"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33799a08-0981-4346-8ec2-d1c0688cd774"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7c5e3ab-4553-4c8a-acec-c38f7af9769f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38d78d5c-9597-440c-8bf8-3f04f7b99c8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=842fb016-5f36-42fa-8bda-029f08b2221f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41594151-0b42-4649-9ff9-2cb044b7a48a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dafb2c8f-4382-4301-9628-e46d99ee5d31"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8d67c13-168c-4568-943f-5801432384df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c14eaff3-05ca-40d5-99fc-6c7136ecaa74"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50c8d455-47db-4dcb-a8dd-33f5fdfee438"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/842fb016-5f36-42fa-8bda-029f08b2221f"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bfc7177-71b3-4917-b6bf-aab53486e377"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8729dc8-9847-4dd7-b8dc-1636f0cdc2f6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7c5e3ab-4553-4c8a-acec-c38f7af9769f"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a8998ef-52b8-4aee-9d51-7530e9eda7ea"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8837b00d-df1b-4bee-935f-69d54f0825b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dafb2c8f-4382-4301-9628-e46d99ee5d31"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38d78d5c-9597-440c-8bf8-3f04f7b99c8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.819672131147541, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8898305084745762, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41594151-0b42-4649-9ff9-2cb044b7a48a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33799a08-0981-4346-8ec2-d1c0688cd774"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50c8d455-47db-4dcb-a8dd-33f5fdfee438"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c14eaff3-05ca-40d5-99fc-6c7136ecaa74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8d67c13-168c-4568-943f-5801432384df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9794de4c-30e1-4dcb-89c9-c331c255ed0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1391, 38, 2.7318475916606757, 319.01222142343556, 80, 2669, 97.0, 895.8, 1082.1999999999996, 1666.319999999996, 5.535547286945103, 803.4297694226675, 4.056928636806813], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1402.344262295082, 990, 1925, 1412.0, 1669.6, 1757.1999999999998, 1925.0, 0.2614939449148001, 314.6640482665309, 1.2857636842246276], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5741769-7b99-4319-a878-fcb0a61b97eb", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8837b00d-df1b-4bee-935f-69d54f0825b7", 3, 0, 0.0, 576.0, 207, 1105, 416.0, 1105.0, 1105.0, 1105.0, 0.02522958926228681, 0.029820520381303194, 0.016179131134995122], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 648.3750000000001, 87, 2669, 453.0, 1566.5000000000011, 2669.0, 2669.0, 0.08198107261985889, 0.01656734200710161, 0.054985962342506675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 648.3750000000001, 87, 2669, 453.0, 1566.5000000000011, 2669.0, 2669.0, 0.08004322334060393, 0.016175727080123267, 0.05368621711974466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 115.3125, 83, 250, 84.0, 249.3, 250.0, 250.0, 0.07631439623388454, 0.02042006305476989, 0.04352305410213728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 96.0625, 83, 265, 85.0, 141.10000000000014, 265.0, 265.0, 0.0763133042706833, 0.056713305224599594, 0.03830570155774532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8729dc8-9847-4dd7-b8dc-1636f0cdc2f6", 3, 0, 0.0, 285.6666666666667, 177, 475, 205.0, 475.0, 475.0, 475.0, 0.039339618930224626, 0.03279582164072437, 0.02522755510824952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a8998ef-52b8-4aee-9d51-7530e9eda7ea", 3, 0, 0.0, 435.33333333333337, 206, 877, 223.0, 877.0, 877.0, 877.0, 0.03720468779066162, 0.03101601739319154, 0.023858474917839646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 135.87499999999997, 83, 251, 85.0, 248.9, 251.0, 251.0, 0.07625402120814966, 0.020552841653759087, 0.044903491004408436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 145.87499999999997, 82, 253, 85.0, 252.3, 253.0, 253.0, 0.0763133042706833, 0.020568820291707604, 0.04486387614350717], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 240.31249999999997, 83, 471, 206.0, 441.6, 471.0, 471.0, 0.08216167363329191, 0.13606021295278786, 0.05310119397600879], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bfc7177-71b3-4917-b6bf-aab53486e377", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33799a08-0981-4346-8ec2-d1c0688cd774", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7c5e3ab-4553-4c8a-acec-c38f7af9769f", 3, 0, 0.0, 288.3333333333333, 203, 431, 231.0, 431.0, 431.0, 431.0, 0.06694037843627276, 0.04382067090994288, 0.042927260911281684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 95.42105263157895, 83, 273, 85.0, 91.0, 273.0, 273.0, 0.09061945552015567, 0.06734512270589695, 0.04548671888414064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 120.4736842105263, 82, 251, 84.0, 250.0, 251.0, 251.0, 0.09062075215224287, 0.04573888703407818, 0.05048045393842559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 624.7777777777777, 491, 702, 653.0, 702.0, 702.0, 702.0, 0.05281690140845071, 15.529922700264084, 0.030122139084507043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 862.4444444444445, 804, 979, 882.0, 979.0, 979.0, 979.0, 0.05274941682589176, 47.46401798352167, 0.03003213868114736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38d78d5c-9597-440c-8bf8-3f04f7b99c8c", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 139.33333333333334, 83, 254, 85.0, 254.0, 254.0, 254.0, 0.0529982275037246, 0.09378201976245017, 0.029345698236925632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 115.36363636363637, 84, 248, 85.0, 247.4, 248.0, 248.0, 0.06437265917602997, 0.047839446907186334, 0.03231205743796817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=842fb016-5f36-42fa-8bda-029f08b2221f", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 158.36363636363635, 83, 252, 85.0, 251.6, 252.0, 252.0, 0.064313193559326, 0.017208803745366527, 0.036678618201803105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 113.45454545454545, 82, 250, 84.0, 248.8, 250.0, 250.0, 0.06431281754453663, 0.017334314103800888, 0.037808902501768604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 113.27272727272727, 82, 250, 84.0, 249.2, 250.0, 250.0, 0.06437378933384832, 0.017350747906388804, 0.03790761227374076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 84.11111111111111, 82, 87, 84.0, 87.0, 87.0, 87.0, 0.0529982275037246, 0.0393863780569672, 0.02975974688929848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 551.5294117647059, 82, 1073, 819.0, 1062.6, 1073.0, 1073.0, 0.09989833874939033, 47.600806651539905, 0.054184289664047765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 213.57894736842107, 81, 908, 85.0, 907.0, 908.0, 908.0, 0.09062161659424887, 12.89554081281628, 0.05204594694819782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 402.8823529411765, 82, 747, 491.0, 682.1999999999999, 747.0, 747.0, 0.09989775171295262, 15.563218106908224, 0.05428152765698638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 179.31578947368425, 82, 495, 86.0, 411.0, 495.0, 495.0, 0.09062118437118437, 4.227774483816964, 0.05213419596354167], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 445.0625000000001, 86, 1595, 433.0, 1074.9000000000005, 1595.0, 1595.0, 0.0800588432497886, 0.016178883666995242, 0.05412669718493092], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41594151-0b42-4649-9ff9-2cb044b7a48a", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 275.0, 168, 497, 181.0, 496.6, 497.0, 497.0, 0.06428012108037352, 0.09962163296343045, 0.14456749887509787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dafb2c8f-4382-4301-9628-e46d99ee5d31", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 716.4583333333334, 238, 1934, 722.5, 1145.5, 1751.5, 1934.0, 0.10367618471640244, 0.0636839064322433, 0.04687702492548274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 94.29411764705883, 82, 250, 85.0, 119.59999999999988, 250.0, 250.0, 0.09989657766077473, 0.0742395464842281, 0.050143399333631065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 123.23529411764706, 83, 251, 85.0, 250.2, 251.0, 251.0, 0.09989833874939033, 0.10616493950274132, 0.052531559795032115], "isController": false}, {"data": ["login", 24, 0, 0.0, 2796.875, 1511, 4294, 2793.5, 3844.5, 4210.75, 4294.0, 0.10692090080858932, 48.110320129251775, 0.22780730013587863], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e8d67c13-168c-4568-943f-5801432384df", 3, 0, 0.0, 353.6666666666667, 201, 457, 403.0, 457.0, 457.0, 457.0, 0.029783474142980534, 0.029870730414883792, 0.019099428405492072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 89.05263157894736, 84, 99, 87.0, 98.0, 99.0, 99.0, 0.09335187268769868, 0.07557490474424043, 0.03318367349445539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c14eaff3-05ca-40d5-99fc-6c7136ecaa74", 3, 0, 0.0, 476.0, 429, 515, 484.0, 515.0, 515.0, 515.0, 0.02179899869932641, 0.021862862953328344, 0.013979175598200855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 666.6470588235292, 168, 1159, 907.0, 1148.6, 1159.0, 1159.0, 0.09984670593970434, 63.31178216825932, 0.21103284993333765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 273.75000000000006, 168, 519, 330.5, 391.60000000000014, 519.0, 519.0, 0.07622278013062679, 0.11813042194072726, 0.17142681898518897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 601.9333333333333, 83, 1064, 890.0, 1012.4000000000001, 1064.0, 1064.0, 0.08451466047643731, 60.674395297604285, 0.13674207956773568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50c8d455-47db-4dcb-a8dd-33f5fdfee438", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["register", 24, 9, 37.5, 1066.7083333333333, 338, 2347, 997.0, 1916.5, 2289.5, 2347.0, 0.10771412670771771, 0.033502880230867275, 0.04859758451070858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 111.09523809523812, 84, 251, 88.0, 250.0, 250.9, 251.0, 0.09886028217549113, 0.07675187922804243, 0.035141740929569114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 349.78947368421046, 169, 993, 182.0, 992.0, 993.0, 993.0, 0.09058273302408071, 17.229025776746937, 0.20006325147912069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/842fb016-5f36-42fa-8bda-029f08b2221f", 3, 0, 0.0, 592.3333333333334, 305, 1008, 464.0, 1008.0, 1008.0, 1008.0, 0.03142447128327066, 0.03151653516398337, 0.020151760556003647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 264.59090909090907, 168, 1220, 175.5, 338.8, 1087.9999999999982, 1220.0, 0.11168192986374804, 6.238418353846427, 0.24987642013726724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 112.16666666666667, 83, 253, 84.0, 253.0, 253.0, 253.0, 0.040885024496943846, 0.03038428090056081, 0.020522365811942517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 111.5, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.04088530309638029, 0.01094001274258613, 0.02331739942215438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 138.83333333333334, 83, 250, 84.5, 250.0, 250.0, 250.0, 0.040885024496943846, 0.011019791758941896, 0.02403592260464863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 111.0, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.04088586030664395, 0.011020017035775128, 0.024076341567291312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 91.33333333333333, 86, 101, 87.0, 101.0, 101.0, 101.0, 0.04385836671442356, 0.012934791745855384, 0.027111666142802842], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 958.688524590164, 653, 1533, 903.0, 1309.8000000000002, 1400.3999999999999, 1533.0, 0.2597878257462512, 310.79655645381104, 0.512979476229414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1066.7083333333333, 338, 2347, 997.0, 1916.5, 2289.5, 2347.0, 0.10710556145627861, 0.0333135950427976, 0.04832301698515695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.71428571428572, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.06755322228870317, 0.018207704445002026, 0.03977987601571095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 106.71428571428572, 80, 248, 84.0, 248.0, 248.0, 248.0, 0.0675551781044017, 0.018208231598452022, 0.03971505587778303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bfc7177-71b3-4917-b6bf-aab53486e377", 3, 0, 0.0, 611.3333333333333, 285, 1173, 376.0, 1173.0, 1173.0, 1173.0, 0.0659152330103487, 0.029824926394656472, 0.04226985971041241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 157.38095238095238, 81, 805, 84.0, 251.4, 749.6999999999991, 805.0, 0.09934855731702125, 4.282359872703747, 0.05799952513755044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8729dc8-9847-4dd7-b8dc-1636f0cdc2f6", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7c5e3ab-4553-4c8a-acec-c38f7af9769f", 1, 0, 0.0, 1595.0, 1595, 1595, 1595.0, 1595.0, 1595.0, 1595.0, 0.6269592476489029, 0.11326900470219436, 0.432259012539185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 127.85714285714286, 82, 654, 84.0, 251.6, 613.7999999999995, 654.0, 0.09934902732571342, 1.416546003921921, 0.05809682006235334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 85.76190476190477, 81, 93, 84.0, 92.8, 93.0, 93.0, 0.09934761731297811, 0.07383157888200816, 0.04986784697155347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 83.57142857142857, 82, 84, 84.0, 84.0, 84.0, 84.0, 0.06755387421468621, 0.018075938998851585, 0.03852681888806323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 107.6190476190476, 82, 252, 84.0, 248.6, 251.7, 252.0, 0.09934949733885275, 0.03368938497930219, 0.056262936132465996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 122.57142857142857, 82, 352, 84.0, 352.0, 352.0, 352.0, 0.06754996284752043, 0.050200704811487355, 0.033906914944946784], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 463.8666666666667, 83, 1173, 457.0, 995.4000000000001, 1173.0, 1173.0, 0.08095024797759297, 0.016031943642437357, 0.05508411405350271], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 113.85714285714286, 84, 249, 88.0, 249.0, 249.0, 249.0, 0.06010699044298852, 0.04731077568071167, 0.021366156759031075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a8998ef-52b8-4aee-9d51-7530e9eda7ea", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1415.0000000000002, 894, 2259, 1298.5, 2148.0, 2232.75, 2259.0, 0.10518058191156943, 0.05443916837219902, 0.048378959062841016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 253.7142857142857, 167, 600, 170.0, 600.0, 600.0, 600.0, 0.06749525122696726, 0.10460445673554397, 0.15179840192939997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8837b00d-df1b-4bee-935f-69d54f0825b7", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dafb2c8f-4382-4301-9628-e46d99ee5d31", 3, 0, 0.0, 316.3333333333333, 188, 549, 212.0, 549.0, 549.0, 549.0, 0.04767504688046277, 0.03120915341035502, 0.030572865349775925], "isController": false}, {"data": ["addBook", 58, 17, 29.310344827586206, 903.5517241379309, 424, 3178, 698.0, 1609.2, 1973.8999999999976, 3178.0, 0.27723075158212723, 81.200790047894, 1.0068846134542953], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/38d78d5c-9597-440c-8bf8-3f04f7b99c8c", 3, 0, 0.0, 275.0, 198, 427, 200.0, 427.0, 427.0, 427.0, 0.017851723583912026, 0.024610042115191223, 0.011447882636818585], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 150.6065573770492, 83, 349, 86.0, 339.40000000000003, 342.0, 349.0, 0.26065591282982586, 0.19371010709325925, 0.12600066098707402], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 533.6721311475411, 408, 750, 494.0, 662.8, 748.4, 750.0, 0.26061916277162067, 76.6306872254954, 0.13107311408924285], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 110.8852459016393, 83, 258, 87.0, 247.8, 249.8, 258.0, 0.2609860137167403, 0.46182290708470064, 0.1269248387020866], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 805.377049180328, 568, 1187, 815.0, 1041.4000000000003, 1080.0, 1187.0, 0.2602100449608832, 234.13745585627237, 0.13061324522450582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 92.81818181818181, 84, 122, 88.0, 110.19999999999999, 120.49999999999997, 122.0, 0.10982044357475527, 0.08204359310028105, 0.03903773580196379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, 9.6045197740113, 158.31073446327676, 83, 2420, 90.0, 284.8000000000002, 332.0999999999999, 1920.7999999999993, 0.7353796553271401, 1.699482150684277, 0.3481011261279976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 87.83333333333333, 86, 91, 87.5, 91.0, 91.0, 91.0, 0.04016440630313416, 0.031103881053110734, 0.014277191303067222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41594151-0b42-4649-9ff9-2cb044b7a48a", 2, 0, 0.0, 1176.0, 206, 2146, 1176.0, 2146.0, 2146.0, 2146.0, 0.027711193936790765, 0.03190575942526984, 0.017224780215593087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33799a08-0981-4346-8ec2-d1c0688cd774", 3, 0, 0.0, 407.0, 297, 471, 453.0, 471.0, 471.0, 471.0, 0.09191739689931981, 0.0415902284147313, 0.05894442444389975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 93.62499999999999, 85, 122, 92.5, 110.10000000000001, 122.0, 122.0, 0.07954460712421388, 0.06455231300802904, 0.0282756220636854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50c8d455-47db-4dcb-a8dd-33f5fdfee438", 3, 0, 0.0, 379.6666666666667, 206, 500, 433.0, 500.0, 500.0, 500.0, 0.06570590038985501, 0.029730208835253406, 0.042135619716150506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 252.0, 167, 504, 170.0, 504.0, 504.0, 504.0, 0.040861635691276724, 0.06332755453325797, 0.09189877636426787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 253.57142857142858, 168, 889, 176.0, 342.0, 834.3999999999992, 889.0, 0.09930768357734651, 5.804031655506375, 0.2221353649439148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c14eaff3-05ca-40d5-99fc-6c7136ecaa74", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 87.63636363636364, 84, 96, 86.0, 95.4, 96.0, 96.0, 0.06659563132658497, 0.05521454198854556, 0.023672665823122004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8d67c13-168c-4568-943f-5801432384df", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 104.52941176470588, 85, 253, 90.0, 168.99999999999991, 253.0, 253.0, 0.10212847762485205, 0.07928919893726308, 0.036303482280709135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9794de4c-30e1-4dcb-89c9-c331c255ed0f", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 93.63636363636364, 83, 250, 84.0, 96.4, 227.04999999999967, 250.0, 0.11173014123705581, 0.08303382566542918, 0.05608329355063153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 136.04545454545456, 83, 251, 85.0, 249.7, 250.85, 251.0, 0.11173808592658807, 0.03752709331145975, 0.06329907016135995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 146.72727272727275, 82, 969, 84.5, 248.4, 860.9999999999984, 969.0, 0.11173751841129566, 4.598821240603891, 0.06525296485347148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 117.63636363636363, 82, 492, 84.0, 249.0, 455.5499999999995, 492.0, 0.11173865344764536, 1.5221514738074438, 0.06536274747572224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6470165348670022], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.21567217828900073], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.21567217828900073], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.6534867002156721], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1391, 38, "401/Unauthorized", 23, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

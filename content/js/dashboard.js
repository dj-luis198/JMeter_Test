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

    var data = {"OkPercent": 98.27327327327328, "KoPercent": 1.7267267267267268};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8190598840952994, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/97e6db84-6759-454a-b7cd-a52087b2c873"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43e420c2-5c45-47d8-8a33-0da9ec995ff1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e36d2184-38bc-4dfe-bedf-5b6b95a27cca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7b86398-f184-420a-8614-95f5d5071a63"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b22dea1e-25ea-4b6a-9327-c8e8adcd8632"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ccf04cd-1da3-4b5c-8ae7-91cbed126411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c089813-2ab5-4fb0-ae13-0728ec2afb51"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daf49382-68d3-417c-a3b2-e1635e5f2754"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0fe2102-8563-4273-817a-a2254fa1a30c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a135923-043d-4f53-b548-39a6ec8f4777"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed203707-bcbb-4cbc-a60d-66b445037d80"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23c837e2-fe9c-480f-9527-274edd4db147"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=458d8aaf-d4b9-4d02-830f-c14de8685ff5"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ec0ea91-b679-4b0a-aa79-6620a077add1"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97e6db84-6759-454a-b7cd-a52087b2c873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90c9d5d0-396a-40fd-9d20-f440e156d3f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43e420c2-5c45-47d8-8a33-0da9ec995ff1"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7b86398-f184-420a-8614-95f5d5071a63"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ccf04cd-1da3-4b5c-8ae7-91cbed126411"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ec0ea91-b679-4b0a-aa79-6620a077add1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/168d0d58-03cc-4afd-b4aa-a4d14e6bd94a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/458d8aaf-d4b9-4d02-830f-c14de8685ff5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/daf49382-68d3-417c-a3b2-e1635e5f2754"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a135923-043d-4f53-b548-39a6ec8f4777"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0fe2102-8563-4273-817a-a2254fa1a30c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b22dea1e-25ea-4b6a-9327-c8e8adcd8632"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c089813-2ab5-4fb0-ae13-0728ec2afb51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed203707-bcbb-4cbc-a60d-66b445037d80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23c837e2-fe9c-480f-9527-274edd4db147"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 23, 1.7267267267267268, 302.50975975975996, 81, 2723, 96.0, 859.1000000000001, 1005.3499999999999, 1411.1100000000024, 5.230832063586812, 736.3017516304625, 3.8217532061917816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/97e6db84-6759-454a-b7cd-a52087b2c873", 3, 0, 0.0, 542.0, 190, 850, 586.0, 850.0, 850.0, 850.0, 0.03795690625909384, 0.031643110979667745, 0.024340854599744423], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1401.428571428571, 1003, 1863, 1380.5, 1667.2, 1745.5, 1863.0, 0.25262891969558215, 303.9984755917043, 1.2421744244797424], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 519.9333333333334, 87, 1672, 466.0, 1187.8000000000002, 1672.0, 1672.0, 0.07620866949824212, 0.01492915927865954, 0.05131185286138151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 519.9333333333334, 87, 1672, 466.0, 1187.8000000000002, 1672.0, 1672.0, 0.07578819725141472, 0.014846789422493938, 0.05102874583164915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 104.29411764705881, 82, 254, 85.0, 252.4, 254.0, 254.0, 0.0878625622790515, 0.023510099672324324, 0.050109117549771556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 95.29411764705883, 83, 253, 85.0, 121.79999999999988, 253.0, 253.0, 0.08793800887656608, 0.0653523679248699, 0.04414075836187008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 112.6470588235294, 81, 256, 83.0, 248.79999999999998, 256.0, 256.0, 0.08793891866167311, 0.023702286670529083, 0.05178434370409071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 125.0, 81, 266, 85.0, 262.8, 266.0, 266.0, 0.08794028337463078, 0.023702654503318453, 0.051699268155788805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43e420c2-5c45-47d8-8a33-0da9ec995ff1", 3, 0, 0.0, 284.0, 162, 396, 294.0, 396.0, 396.0, 396.0, 0.02800100803628931, 0.028083042239520625, 0.01795637559618813], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 197.93333333333334, 84, 399, 187.0, 355.20000000000005, 399.0, 399.0, 0.07630481229016177, 0.1555555069818903, 0.04931993336046393], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.79999999999998, 83, 96, 85.0, 89.9, 95.69999999999999, 96.0, 0.10375596596804317, 0.0771077051774227, 0.05208063135505292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 100.7, 81, 255, 84.0, 229.10000000000034, 254.5, 255.0, 0.10375704250926032, 0.0433469363139273, 0.058302541269363656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 526.6666666666667, 477, 733, 486.5, 733.0, 733.0, 733.0, 0.061051924661924974, 17.95129296529198, 0.03481867578375408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 877.6666666666667, 728, 997, 900.0, 997.0, 997.0, 997.0, 0.06090133982947625, 54.79913263169915, 0.03467332140682095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 198.33333333333331, 84, 260, 250.5, 260.0, 260.0, 260.0, 0.061299550469963215, 0.10847147016755211, 0.033942231559051905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 97.17647058823529, 83, 248, 86.0, 132.7999999999999, 248.0, 248.0, 0.10330641289750181, 0.07677361349120984, 0.05185497678644134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 114.0, 82, 262, 84.0, 258.0, 262.0, 262.0, 0.10330892406794082, 0.03677057062988059, 0.058407998085746406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 152.1764705882353, 81, 746, 85.0, 350.7999999999996, 746.0, 746.0, 0.10330892406794082, 5.494298306417307, 0.06021210613472699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 136.8235294117647, 81, 644, 84.0, 337.59999999999974, 644.0, 644.0, 0.10330955187962614, 1.813056523238572, 0.060313360279908114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 84.5, 81, 88, 84.5, 88.0, 88.0, 88.0, 0.06130205566226655, 0.045557484725571126, 0.03442254102129225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 165.8, 82, 906, 85.0, 806.3000000000017, 905.0, 906.0, 0.10375650423585929, 9.361197547844718, 0.06010581866475755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 544.5294117647057, 81, 974, 804.0, 966.8, 974.0, 974.0, 0.08330066640533125, 44.09988385375833, 0.04476070964817718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 145.10000000000002, 82, 646, 84.5, 540.3000000000006, 642.3499999999999, 646.0, 0.10375650423585929, 3.075954786806323, 0.060207143375925386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 409.88235294117646, 82, 729, 496.0, 699.4, 729.0, 729.0, 0.08330025823080052, 14.41691656744136, 0.04484183822844851], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 383.06666666666666, 86, 683, 383.0, 617.0, 683.0, 683.0, 0.0757920266787934, 0.014847539601333939, 0.05153463064018999], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e36d2184-38bc-4dfe-bedf-5b6b95a27cca", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7b86398-f184-420a-8614-95f5d5071a63", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 270.52941176470586, 168, 831, 176.0, 574.1999999999998, 831.0, 831.0, 0.10325370650437612, 7.416923472300675, 0.230665980712815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b22dea1e-25ea-4b6a-9327-c8e8adcd8632", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 479.1363636363636, 140, 1197, 424.5, 967.6, 1163.8499999999995, 1197.0, 0.09966747306713057, 0.06122152398361829, 0.04506449221687642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 85.52941176470588, 82, 94, 85.0, 93.2, 94.0, 94.0, 0.0832994418937393, 0.061905151641734, 0.041812415169318363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 158.47058823529412, 82, 329, 86.0, 276.19999999999993, 329.0, 329.0, 0.08330107458386214, 0.09588619786945252, 0.043392356636400606], "isController": false}, {"data": ["login", 22, 0, 0.0, 2312.8636363636356, 1345, 3928, 2434.5, 3237.3, 3826.5999999999985, 3928.0, 0.09711437866661958, 31.818624344477943, 0.1904438485766122], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ccf04cd-1da3-4b5c-8ae7-91cbed126411", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 124.25, 84, 258, 89.0, 256.9, 257.95, 258.0, 0.09658289710058143, 0.07819064618787305, 0.03433220170372231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c089813-2ab5-4fb0-ae13-0728ec2afb51", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 631.6470588235294, 167, 1069, 887.0, 1053.8, 1069.0, 1069.0, 0.0832647623525724, 58.64937304235972, 0.17473259613406605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daf49382-68d3-417c-a3b2-e1635e5f2754", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0fe2102-8563-4273-817a-a2254fa1a30c", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a135923-043d-4f53-b548-39a6ec8f4777", 3, 0, 0.0, 262.6666666666667, 162, 425, 201.0, 425.0, 425.0, 425.0, 0.027853601470670158, 0.02793520381872876, 0.017861847297272204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed203707-bcbb-4cbc-a60d-66b445037d80", 3, 0, 0.0, 382.0, 204, 519, 423.0, 519.0, 519.0, 519.0, 0.04677341399148724, 0.030618924328411734, 0.02999466977969722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 260.70588235294116, 167, 516, 176.0, 386.39999999999986, 516.0, 516.0, 0.08782352637288837, 0.13610931284548225, 0.1975171691765253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 627.9, 84, 1085, 852.0, 1078.0, 1085.0, 1085.0, 0.10141473556107702, 72.80722326454034, 0.16408587292733634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23c837e2-fe9c-480f-9527-274edd4db147", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 914.3478260869566, 318, 1744, 880.0, 1379.0000000000002, 1686.1999999999991, 1744.0, 0.0949068056432412, 0.029900157008867598, 0.04281928145232171], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=458d8aaf-d4b9-4d02-830f-c14de8685ff5", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 269.29999999999995, 168, 993, 173.0, 908.0000000000014, 991.9499999999999, 993.0, 0.10371077140071769, 12.55207212500778, 0.23059441828628321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 88.54545454545455, 85, 102, 87.0, 99.60000000000001, 102.0, 102.0, 0.12465012974945323, 0.09677427065509309, 0.044309225809375956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 342.0, 167, 968, 332.0, 591.9999999999997, 968.0, 968.0, 0.1760855154126616, 12.648580245794664, 0.3933702670544001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 85.53846153846155, 82, 94, 85.0, 92.0, 94.0, 94.0, 0.0634517766497462, 0.04715508010786802, 0.03184981757614213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 85.92307692307693, 82, 107, 84.0, 100.19999999999999, 107.0, 107.0, 0.06345270576980334, 0.024309555245342326, 0.03577794542579206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 166.76923076923077, 82, 970, 84.0, 682.7999999999997, 970.0, 970.0, 0.06345270576980334, 4.407698925757893, 0.03688379186048214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 163.3846153846154, 82, 757, 85.0, 556.5999999999998, 757.0, 757.0, 0.0634523960600943, 1.4509492386932712, 0.03694557706293502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.5, 86, 89, 87.5, 89.0, 89.0, 89.0, 0.22606533288120267, 0.06667161184582344, 0.13974546456425907], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 967.892857142857, 657, 1499, 900.5, 1322.1000000000001, 1393.95, 1499.0, 0.27075245006792986, 323.9140590627131, 0.5346303262083537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ec0ea91-b679-4b0a-aa79-6620a077add1", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 914.3478260869566, 318, 1744, 880.0, 1379.0000000000002, 1686.1999999999991, 1744.0, 0.09305072882994776, 0.0293154045481578, 0.041981871796324094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97e6db84-6759-454a-b7cd-a52087b2c873", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 116.8, 83, 245, 86.0, 245.0, 245.0, 245.0, 0.034101992238386565, 0.009191552595502629, 0.020081544257565528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 84.8, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.03410152706638203, 0.009191427217110781, 0.02004796806050975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 158.9090909090909, 82, 739, 84.0, 642.0000000000003, 739.0, 739.0, 0.11499419802000899, 9.434720619635783, 0.06670561877332554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 172.63636363636363, 81, 649, 85.0, 585.6000000000003, 649.0, 649.0, 0.11499299588115997, 3.1019728159171214, 0.0668172192864162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 85.2, 83, 91, 84.0, 91.0, 91.0, 91.0, 0.03410152706638203, 0.009124822672059255, 0.019448527155046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 99.63636363636364, 82, 248, 86.0, 215.6000000000001, 248.0, 248.0, 0.11499059167886264, 0.08545687526134225, 0.0577198868388041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 85.8, 83, 88, 87.0, 88.0, 88.0, 88.0, 0.03410106190706779, 0.025342683702420495, 0.017117134590071137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 143.72727272727272, 81, 253, 85.0, 252.6, 253.0, 253.0, 0.11499419802000899, 0.046471376898711024, 0.06470465439016486], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 783.6428571428571, 89, 2132, 486.0, 2012.5, 2132.0, 2132.0, 0.07299460361323289, 0.014093824135144296, 0.049674620037018696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 90.6, 85, 99, 89.0, 99.0, 99.0, 99.0, 0.034716195105016494, 0.027325442631487586, 0.01234052247873633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1341.7727272727273, 883, 2723, 1215.5, 2382.7, 2694.4999999999995, 2723.0, 0.0973266148476175, 0.05037412682542702, 0.04476644100901156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 204.6, 169, 329, 175.0, 329.0, 329.0, 329.0, 0.03408130435968045, 0.052819365252746955, 0.07664965228549227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90c9d5d0-396a-40fd-9d20-f440e156d3f7", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43e420c2-5c45-47d8-8a33-0da9ec995ff1", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 847.8852459016396, 431, 1959, 695.0, 1450.6000000000001, 1551.1, 1959.0, 0.2888476399727252, 91.7760659839287, 1.0495327830233352], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 143.33928571428564, 82, 345, 87.0, 337.90000000000003, 341.45, 345.0, 0.2717668240649523, 0.2019673370248327, 0.13137165811733534], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 532.7500000000001, 403, 775, 492.5, 712.5000000000001, 759.75, 775.0, 0.2716903506261007, 79.88598405274675, 0.13664114313715026], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 132.76785714285708, 82, 345, 88.0, 251.60000000000002, 259.05, 345.0, 0.27212867798916346, 0.4815401997230119, 0.13234382972519862], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 822.8571428571425, 571, 1160, 802.0, 1051.0, 1079.05, 1160.0, 0.27122978490509375, 244.05303722870966, 0.13614463812618965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 109.4705882352941, 84, 259, 87.0, 252.6, 259.0, 259.0, 0.17436970480234681, 0.13026642985722198, 0.06198298100395922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, 5.056179775280899, 141.30898876404504, 82, 878, 91.0, 263.5, 328.04999999999995, 521.7100000000036, 0.7885037919058757, 1.694795182817705, 0.3800151180651534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 92.23076923076923, 84, 121, 89.0, 113.8, 121.0, 121.0, 0.061271333028547724, 0.04744938192542807, 0.021780044162491578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 90.11764705882354, 84, 101, 89.0, 95.39999999999999, 101.0, 101.0, 0.08703309305373526, 0.0706293948512246, 0.030937544796444953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7b86398-f184-420a-8614-95f5d5071a63", 3, 0, 0.0, 682.3333333333333, 172, 1471, 404.0, 1471.0, 1471.0, 1471.0, 0.019903006017342153, 0.0274379005479961, 0.012763320916069024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 279.6923076923077, 168, 1054, 173.0, 770.3999999999997, 1054.0, 1054.0, 0.06342577233075077, 5.927603444995219, 0.141397734785133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ccf04cd-1da3-4b5c-8ae7-91cbed126411", 3, 0, 0.0, 775.6666666666666, 198, 1893, 236.0, 1893.0, 1893.0, 1893.0, 0.06304640215198387, 0.02852685514038332, 0.040430147213349026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 312.3636363636364, 168, 988, 175.0, 873.8000000000004, 988.0, 988.0, 0.11488850592720247, 12.657012931484672, 0.2557146424095253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ec0ea91-b679-4b0a-aa79-6620a077add1", 3, 0, 0.0, 277.3333333333333, 187, 419, 226.0, 419.0, 419.0, 419.0, 0.05992928344553427, 0.027116440100681198, 0.038431213667871916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/168d0d58-03cc-4afd-b4aa-a4d14e6bd94a", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 102.05882352941175, 84, 260, 91.0, 140.7999999999999, 260.0, 260.0, 0.10370975908833022, 0.08598592330663316, 0.03686557842592988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/458d8aaf-d4b9-4d02-830f-c14de8685ff5", 3, 0, 0.0, 329.3333333333333, 182, 453, 353.0, 453.0, 453.0, 453.0, 0.021940730772606266, 0.026318877896176464, 0.014070064981130972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daf49382-68d3-417c-a3b2-e1635e5f2754", 3, 0, 0.0, 905.0, 184, 2132, 399.0, 2132.0, 2132.0, 2132.0, 0.04218756591807175, 0.03453832300909845, 0.02705387527949262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a135923-043d-4f53-b548-39a6ec8f4777", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 90.76470588235293, 84, 116, 88.0, 109.6, 116.0, 116.0, 0.08451446440201045, 0.06561425703085773, 0.03004225101790215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0fe2102-8563-4273-817a-a2254fa1a30c", 3, 0, 0.0, 528.3333333333333, 190, 1138, 257.0, 1138.0, 1138.0, 1138.0, 0.046031331993310116, 0.02959371116106363, 0.0295187903733141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b22dea1e-25ea-4b6a-9327-c8e8adcd8632", 3, 0, 0.0, 280.6666666666667, 215, 378, 249.0, 378.0, 378.0, 378.0, 0.02334430515675701, 0.027592178393289292, 0.01497014360638389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c089813-2ab5-4fb0-ae13-0728ec2afb51", 3, 0, 0.0, 446.33333333333337, 175, 826, 338.0, 826.0, 826.0, 826.0, 0.021351249403944287, 0.025236453966706283, 0.013692044702399169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed203707-bcbb-4cbc-a60d-66b445037d80", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23c837e2-fe9c-480f-9527-274edd4db147", 2, 0, 0.0, 256.5, 187, 326, 256.5, 326.0, 326.0, 326.0, 0.011698369247326923, 0.023133982154137714, 0.007271496119066002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 93.82352941176471, 81, 246, 84.0, 120.39999999999989, 246.0, 246.0, 0.17654633822124371, 0.1312028939319985, 0.08861798617746022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 150.64705882352942, 81, 251, 85.0, 251.0, 251.0, 251.0, 0.1765536723163842, 0.06284045000415421, 0.09981854566508808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 189.11764705882356, 81, 885, 85.0, 378.59999999999957, 885.0, 885.0, 0.17624250969333802, 9.373139167435568, 0.1027203873706691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 206.41176470588232, 81, 699, 244.0, 342.1999999999997, 699.0, 699.0, 0.17624981856636326, 3.0931397674020777, 0.10289676620461567], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.45045045045045046], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15015015015015015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15015015015015015], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 0.975975975975976], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 23, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

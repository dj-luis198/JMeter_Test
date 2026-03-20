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

    var data = {"OkPercent": 98.3167559296098, "KoPercent": 1.6832440703902065};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8044328552803129, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab9ef663-5e35-4f78-b961-bd70c7e8b8cd"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d418b62-9094-4bf6-b9f5-aaf8b2e9eb0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62560c49-b3a3-4516-aaa4-a7a0284f421b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a498803-dd70-419d-a596-5b2e9bc0f6cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/485c4d98-dc62-402f-a144-833abb42fe02"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b44a619-87c2-4a0e-80d2-59a5769f5d77"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac1e52af-41bb-4bc9-9fc8-40929167d55c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cb2281c-be92-4cd4-a230-b16b6ae02a0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b454c9a8-3efe-4cd4-941c-5161d28c2485"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c032fbb-c3d1-4c99-a13b-a1660badcf9a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e247c23-7efa-44a9-b49c-81f0202533f3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99961e47-1b82-4331-8739-0ce1ed050e06"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6a5000f-a9e3-45b3-964b-cf957a3a2b11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/824c3869-f7a6-44c3-93c9-57d6d378b3c5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f97df849-accf-44ed-b191-0a7cec23868d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ca040e2-8074-44be-a6cf-f909a93fb45e"], "isController": false}, {"data": [0.36, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62560c49-b3a3-4516-aaa4-a7a0284f421b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac1e52af-41bb-4bc9-9fc8-40929167d55c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=824c3869-f7a6-44c3-93c9-57d6d378b3c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=485c4d98-dc62-402f-a144-833abb42fe02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b44a619-87c2-4a0e-80d2-59a5769f5d77"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b454c9a8-3efe-4cd4-941c-5161d28c2485"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99961e47-1b82-4331-8739-0ce1ed050e06"], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/838acb19-44e6-4664-9ce7-cadcdeca5e4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e247c23-7efa-44a9-b49c-81f0202533f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9497041420118343, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a498803-dd70-419d-a596-5b2e9bc0f6cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6a5000f-a9e3-45b3-964b-cf957a3a2b11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d418b62-9094-4bf6-b9f5-aaf8b2e9eb0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab9ef663-5e35-4f78-b961-bd70c7e8b8cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ca040e2-8074-44be-a6cf-f909a93fb45e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f97df849-accf-44ed-b191-0a7cec23868d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1307, 22, 1.6832440703902065, 326.9793420045898, 98, 2121, 125.0, 813.0, 1005.5999999999999, 1323.5200000000004, 5.08576142448014, 720.1633693242396, 3.709753428608672], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab9ef663-5e35-4f78-b961-bd70c7e8b8cd", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1481.9272727272728, 1200, 1852, 1458.0, 1743.4, 1751.6, 1852.0, 0.2503949411116625, 301.3090044652816, 1.231189969235567], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d418b62-9094-4bf6-b9f5-aaf8b2e9eb0e", 3, 0, 0.0, 361.6666666666667, 302, 399, 384.0, 399.0, 399.0, 399.0, 0.06814464837361439, 0.03083367878884245, 0.04369953036979829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62560c49-b3a3-4516-aaa4-a7a0284f421b", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a498803-dd70-419d-a596-5b2e9bc0f6cf", 3, 0, 0.0, 302.3333333333333, 207, 455, 245.0, 455.0, 455.0, 455.0, 0.1733302519066328, 0.07842742517910793, 0.11115253784377167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/485c4d98-dc62-402f-a144-833abb42fe02", 3, 0, 0.0, 384.6666666666667, 343, 431, 380.0, 431.0, 431.0, 431.0, 0.037086485684616526, 0.030917477160905902, 0.023782674739158384], "isController": false}, {"data": ["deleteBook", 17, 2, 11.764705882352942, 506.5294117647059, 105, 887, 484.0, 850.1999999999999, 887.0, 887.0, 0.09361800549592762, 0.018171831374697807, 0.06310395659979404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, 11.764705882352942, 506.5294117647059, 105, 887, 484.0, 850.1999999999999, 887.0, 887.0, 0.09186160239056311, 0.017830902715861255, 0.06192003920328972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 159.0, 98, 306, 102.5, 305.5, 306.0, 306.0, 0.0845441259949032, 0.02262215871347996, 0.04821657185646823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 103.64285714285714, 99, 109, 103.0, 108.0, 109.0, 109.0, 0.08454259437067098, 0.06282901788679747, 0.0424364194399657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 144.64285714285717, 98, 306, 102.0, 304.0, 306.0, 306.0, 0.08454514710855597, 0.022787559181602975, 0.049785862994589106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 188.99999999999997, 100, 307, 103.0, 306.5, 307.0, 307.0, 0.08444213904001352, 0.02275979528812864, 0.04964274189657044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b44a619-87c2-4a0e-80d2-59a5769f5d77", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["goToProfile", 17, 2, 11.764705882352942, 227.47058823529417, 102, 431, 199.0, 405.4, 431.0, 431.0, 0.09311598965864773, 0.1794761489554577, 0.060187334308312516], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 104.35, 100, 134, 103.0, 106.80000000000001, 132.64999999999998, 134.0, 0.1067338378286068, 0.07932075252692361, 0.0535753834413124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 122.5, 100, 304, 102.0, 279.5000000000004, 303.7, 304.0, 0.10673725557168474, 0.04459199016949876, 0.05997716489838613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 581.8571428571429, 489, 774, 510.0, 774.0, 774.0, 774.0, 0.04793108878891834, 14.093331565874434, 0.027335699074929984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 843.0, 704, 907, 891.0, 907.0, 907.0, 907.0, 0.047796251408282406, 43.00715103402069, 0.027212123604520157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 217.57142857142858, 102, 307, 299.0, 307.0, 307.0, 307.0, 0.04799221154966851, 0.08492371809374935, 0.02657381244986528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac1e52af-41bb-4bc9-9fc8-40929167d55c", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cb2281c-be92-4cd4-a230-b16b6ae02a0a", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 148.11111111111111, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.05735223833041262, 0.042622122431097656, 0.028788135255695395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 147.0, 101, 303, 102.0, 303.0, 303.0, 303.0, 0.05727996537744315, 0.02488595718004366, 0.032132966688517915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 235.88888888888889, 101, 902, 102.0, 902.0, 902.0, 902.0, 0.05727960082482625, 5.740421627583947, 0.03312719969578168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 235.7777777777778, 98, 706, 106.0, 706.0, 706.0, 706.0, 0.057354796772836766, 1.8875428766935596, 0.033226699215513834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b454c9a8-3efe-4cd4-941c-5161d28c2485", 3, 0, 0.0, 1117.0, 181, 2121, 1049.0, 2121.0, 2121.0, 2121.0, 0.01676043197220003, 0.02310560852938383, 0.01074806347175588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 130.71428571428572, 100, 302, 103.0, 302.0, 302.0, 302.0, 0.04805843906189927, 0.03571530481064975, 0.026985939902921953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 598.4, 100, 920, 708.0, 912.8, 920.0, 920.0, 0.08178308943798661, 49.066392789866526, 0.04339402206507753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 211.74999999999997, 100, 904, 102.5, 824.3000000000012, 902.9, 904.0, 0.10673497705197993, 9.629923567750026, 0.06183123865940869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c032fbb-c3d1-4c99-a13b-a1660badcf9a", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 509.7333333333333, 102, 815, 688.0, 807.8, 815.0, 815.0, 0.08178264354216985, 16.03855608653694, 0.04347365133605578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 143.85, 99, 523, 102.5, 459.6000000000008, 521.75, 523.0, 0.10673440743725351, 3.1642374026715623, 0.06193514150314066], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 409.8125, 108, 1165, 387.5, 827.6000000000004, 1165.0, 1165.0, 0.09585143028306126, 0.018685880635015726, 0.06523092331885577], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 429.3333333333333, 206, 1207, 397.0, 1207.0, 1207.0, 1207.0, 0.057240984544934176, 7.687757385677034, 0.12710902221268205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e247c23-7efa-44a9-b49c-81f0202533f3", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 500.04166666666663, 137, 1297, 415.0, 813.5, 1186.5, 1297.0, 0.1039874868390837, 0.06387512619314809, 0.047017779693843506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 103.53333333333332, 101, 106, 104.0, 105.4, 106.0, 106.0, 0.08178531899000582, 0.06077990991347113, 0.04105239644615527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 156.06666666666663, 100, 306, 103.0, 305.4, 306.0, 306.0, 0.08178576491499732, 0.10377633842404282, 0.04206429315289576], "isController": false}, {"data": ["login", 24, 0, 0.0, 2168.3749999999995, 1323, 3762, 2157.0, 2893.5, 3565.5, 3762.0, 0.10107391029690461, 35.40545953753422, 0.20138285691724575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 108.15, 103, 124, 106.0, 122.10000000000002, 123.95, 124.0, 0.10393119754722374, 0.08413961207680515, 0.03694429287811469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99961e47-1b82-4331-8739-0ce1ed050e06", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6a5000f-a9e3-45b3-964b-cf957a3a2b11", 3, 0, 0.0, 836.3333333333334, 359, 1132, 1018.0, 1132.0, 1132.0, 1132.0, 0.01847347516857046, 0.025467176868130176, 0.011846597031928321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/824c3869-f7a6-44c3-93c9-57d6d378b3c5", 3, 0, 0.0, 311.3333333333333, 218, 469, 247.0, 469.0, 469.0, 469.0, 0.07305669199298655, 0.033056250608805765, 0.04684950625852328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 709.9333333333334, 206, 1022, 907.0, 1016.0, 1022.0, 1022.0, 0.08173585152410118, 65.23188780358058, 0.1698839231710241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97df849-accf-44ed-b191-0a7cec23868d", 3, 0, 0.0, 313.0, 199, 398, 342.0, 398.0, 398.0, 398.0, 0.033226638903963934, 0.027699681716488164, 0.021307447474221666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 336.7142857142857, 203, 412, 407.0, 411.5, 412.0, 412.0, 0.08438767698808326, 0.1307844173633673, 0.18978986338237863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 663.7272727272727, 102, 1189, 877.0, 1153.2, 1189.0, 1189.0, 0.07505560938331582, 57.14804996144871, 0.12578344622947912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ca040e2-8074-44be-a6cf-f909a93fb45e", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["register", 25, 7, 28.0, 910.2000000000002, 189, 1397, 907.0, 1385.4, 1394.6, 1397.0, 0.10257378132090413, 0.032246632502759234, 0.04627840524439229], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 337.15, 203, 1005, 209.0, 929.1000000000012, 1003.9499999999999, 1005.0, 0.1066740627350163, 12.910718059785479, 0.2371831113623878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 115.50000000000001, 103, 304, 105.5, 116.7, 275.9499999999996, 304.0, 0.1307570237323998, 0.10151546276099399, 0.04648003577987649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 426.4375, 205, 1009, 404.5, 869.7000000000002, 1009.0, 1009.0, 0.094817624225903, 14.307935512904086, 0.21021456191294557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 103.57142857142858, 102, 110, 103.0, 110.0, 110.0, 110.0, 0.04155486429368603, 0.030882081765131908, 0.020858593991166623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62560c49-b3a3-4516-aaa4-a7a0284f421b", 3, 0, 0.0, 316.3333333333333, 179, 569, 201.0, 569.0, 569.0, 569.0, 0.05686018081537499, 0.03537103044862683, 0.03646307168173461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac1e52af-41bb-4bc9-9fc8-40929167d55c", 3, 0, 0.0, 446.0, 198, 863, 277.0, 863.0, 863.0, 863.0, 0.02475656048852946, 0.024829089474335698, 0.015875789115365573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 159.57142857142856, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.04155511098182854, 0.011119238680684592, 0.02369939923182409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 189.2857142857143, 102, 307, 105.0, 307.0, 307.0, 307.0, 0.04150607767565965, 0.01118718499851764, 0.024401033946042098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 189.0, 101, 308, 105.0, 308.0, 308.0, 308.0, 0.04150558546592984, 0.011187052332613905, 0.024441277378862987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 108.5, 108, 109, 108.5, 109.0, 109.0, 109.0, 0.1032844453625284, 0.03046084228465193, 0.06384673233835984], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 959.0727272727274, 782, 1427, 812.0, 1315.2, 1325.0, 1427.0, 0.23886353075042235, 285.76382517686756, 0.4716621671653848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 910.2000000000002, 189, 1397, 907.0, 1385.4, 1394.6, 1397.0, 0.10058824002768188, 0.031622427958702494, 0.045382584856239284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 103.33333333333333, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.04200523665283606, 0.011321723941584719, 0.024735505568027484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=824c3869-f7a6-44c3-93c9-57d6d378b3c5", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 102.11111111111111, 99, 107, 101.0, 107.0, 107.0, 107.0, 0.0420048445587391, 0.01132161825997265, 0.024694254320664983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=485c4d98-dc62-402f-a144-833abb42fe02", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 138.90909090909093, 100, 304, 103.0, 302.7, 303.85, 304.0, 0.12189108477524946, 0.03285345644332895, 0.0716586260104494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 147.77272727272728, 100, 304, 102.5, 303.7, 304.0, 304.0, 0.12175751437568834, 0.03281745504657225, 0.07169900504740241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 125.0, 99, 303, 103.0, 303.0, 303.0, 303.0, 0.0420046485144356, 0.011239525090776713, 0.023955776105889053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 131.22727272727272, 100, 308, 103.5, 304.4, 307.55, 308.0, 0.12188703288179728, 0.09058206252250754, 0.0611815770519959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 103.44444444444444, 100, 107, 103.0, 107.0, 107.0, 107.0, 0.0420046485144356, 0.03121634523387255, 0.021084364586347555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 156.0909090909091, 99, 304, 102.5, 303.7, 304.0, 304.0, 0.12175818823815901, 0.03257982771216364, 0.06944021672957507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 108.11111111111111, 103, 127, 107.0, 127.0, 127.0, 127.0, 0.04280903365741358, 0.03369539172644077, 0.015217273682908731], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 523.4375, 102, 1049, 442.0, 1027.3, 1049.0, 1049.0, 0.09651694475611375, 0.01848572831083282, 0.06568383386417653], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5b44a619-87c2-4a0e-80d2-59a5769f5d77", 3, 0, 0.0, 275.3333333333333, 181, 383, 262.0, 383.0, 383.0, 383.0, 0.09306654257794324, 0.04374612222739259, 0.05968134403598573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1083.7499999999998, 711, 1742, 1005.0, 1551.0, 1702.75, 1742.0, 0.1008869645634537, 0.05221688595569381, 0.046404062802135444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 230.66666666666663, 204, 406, 209.0, 406.0, 406.0, 406.0, 0.04198407404124702, 0.0650671147494717, 0.0944231665204999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b454c9a8-3efe-4cd4-941c-5161d28c2485", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99961e47-1b82-4331-8739-0ce1ed050e06", 3, 0, 0.0, 274.3333333333333, 196, 429, 198.0, 429.0, 429.0, 429.0, 0.021321810079530355, 0.02520165768189281, 0.013673165968969659], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 987.9473684210521, 525, 2194, 863.0, 1504.2, 1679.5999999999972, 2194.0, 0.27242617011819475, 86.82538210608132, 0.9901959437177091], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/838acb19-44e6-4664-9ce7-cadcdeca5e4d", 2, 0, 0.0, 204.0, 194, 214, 204.0, 214.0, 214.0, 214.0, 0.013819598955238318, 0.02731530105996324, 0.008590014389657412], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 189.54545454545465, 101, 433, 104.0, 413.0, 414.4, 433.0, 0.2395939970813095, 0.1780576482215591, 0.11581936382348457], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 576.0545454545454, 486, 815, 508.0, 708.4, 807.4, 815.0, 0.2395366055485388, 70.43171539512652, 0.12047007017333738], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 175.65454545454546, 100, 406, 106.0, 308.0, 309.79999999999995, 406.0, 0.2399588143416839, 0.4246146206905579, 0.11669872025601424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e247c23-7efa-44a9-b49c-81f0202533f3", 3, 0, 0.0, 352.0, 220, 593, 243.0, 593.0, 593.0, 593.0, 0.02156473734149918, 0.02162791528292935, 0.01382894940193795], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 764.7818181818185, 679, 1011, 704.0, 912.8, 1010.0, 1011.0, 0.23933438930566917, 215.35350420222233, 0.12013464463194723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 105.375, 103, 109, 105.0, 108.3, 109.0, 109.0, 0.0882495697833473, 0.06592863367603582, 0.031369964258924236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 165.17159763313606, 100, 1701, 109.0, 280.0, 322.5, 1176.7000000000085, 0.6989044982155189, 1.5182482181036943, 0.33557964745644253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a498803-dd70-419d-a596-5b2e9bc0f6cf", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 115.14285714285714, 105, 140, 113.0, 140.0, 140.0, 140.0, 0.0421498849910281, 0.03264146366980984, 0.014982966930404518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 106.21428571428571, 102, 124, 105.0, 116.0, 124.0, 124.0, 0.08429773961632486, 0.06840959142691988, 0.029965212129240477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 323.5714285714286, 206, 412, 406.0, 412.0, 412.0, 412.0, 0.04148000663680106, 0.0642859087232454, 0.09328950711382114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 334.4545454545455, 204, 611, 306.5, 609.4, 610.85, 611.0, 0.1216827619774555, 0.1885845149006073, 0.27366738362703125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6a5000f-a9e3-45b3-964b-cf957a3a2b11", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 0.15507644849785407, 0.5918052575107295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 131.66666666666663, 104, 307, 109.0, 307.0, 307.0, 307.0, 0.0607558021791081, 0.05037273051763944, 0.021596789055854836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d418b62-9094-4bf6-b9f5-aaf8b2e9eb0e", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 121.53333333333333, 103, 323, 106.0, 199.4000000000001, 323.0, 323.0, 0.07955618257613527, 0.061764809714870646, 0.028279736775110583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab9ef663-5e35-4f78-b961-bd70c7e8b8cd", 3, 0, 0.0, 439.66666666666663, 263, 757, 299.0, 757.0, 757.0, 757.0, 0.04940548730278976, 0.03073368692566121, 0.03168255533414578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ca040e2-8074-44be-a6cf-f909a93fb45e", 3, 0, 0.0, 315.6666666666667, 179, 423, 345.0, 423.0, 423.0, 423.0, 0.01960438354015958, 0.023171717654400858, 0.01257182147594869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 115.5, 99, 307, 103.0, 165.60000000000014, 307.0, 307.0, 0.09498874976994912, 0.07059222517083133, 0.04767989978686899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f97df849-accf-44ed-b191-0a7cec23868d", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 164.93749999999997, 100, 305, 103.0, 302.9, 305.0, 305.0, 0.09487666034155598, 0.04319945594165086, 0.05311332572343454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 251.43750000000003, 99, 906, 104.5, 758.3000000000002, 906.0, 906.0, 0.0948760977460997, 10.693585504859435, 0.05475759157025872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 259.125, 101, 705, 205.5, 704.3, 705.0, 705.0, 0.09498874976994912, 3.5136329263659083, 0.05491537096075184], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5355776587605203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.1530221882172915], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.1530221882172915], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8416220351951033], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1307, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

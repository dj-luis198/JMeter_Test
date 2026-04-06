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

    var data = {"OkPercent": 98.05749805749805, "KoPercent": 1.9425019425019425};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7699468085106383, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.037037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cd8604f-46f5-4969-aa0a-9128d137c593"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e592fa01-f9b6-414b-834d-2d05a70e539c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae472901-7730-4be6-a480-1b8318267983"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f455f9f-d7ce-4ab7-bdce-e620030aa7b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7304d1a9-543c-4ff8-9689-d7eb15e47e79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58de49d2-04e6-4d24-ba7e-34335e7b3f30"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0740749a-1c86-49ed-b1e0-2ee14a3e7aff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0f10fe1-5bbd-4710-b5ea-d967f999cecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=447c79d4-6d4d-44c5-ba2e-38f6ac2cc3d5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c20e00f8-1df8-4acf-b9d8-fc3a3da43b24"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17faf5e1-fe67-48e8-bc0a-da2961fd8c3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/633e1f16-e0b7-4a3b-98a0-adacfea0c8c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae472901-7730-4be6-a480-1b8318267983"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/badd79df-d11e-49aa-8270-c17837b38296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45815b79-4947-4e35-9c75-e3959343cffe"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7304d1a9-543c-4ff8-9689-d7eb15e47e79"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f455f9f-d7ce-4ab7-bdce-e620030aa7b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e592fa01-f9b6-414b-834d-2d05a70e539c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58de49d2-04e6-4d24-ba7e-34335e7b3f30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0f10fe1-5bbd-4710-b5ea-d967f999cecd"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cd8604f-46f5-4969-aa0a-9128d137c593"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1801c7cc-f6c2-4c2f-a517-1a15bc0adf4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0740749a-1c86-49ed-b1e0-2ee14a3e7aff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/447c79d4-6d4d-44c5-ba2e-38f6ac2cc3d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f6b86f3-f416-447b-9684-e89a6e185847"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1801c7cc-f6c2-4c2f-a517-1a15bc0adf4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=633e1f16-e0b7-4a3b-98a0-adacfea0c8c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17faf5e1-fe67-48e8-bc0a-da2961fd8c3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/572dc24e-7abe-4c2e-9fe6-5817afdc5fb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 25, 1.9425019425019425, 399.3092463092461, 113, 2197, 129.0, 1138.0, 1365.0, 1816.5999999999995, 5.007411903400137, 701.4548824089853, 3.652256131842393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1882.4074074074072, 1378, 2575, 1870.5, 2211.5, 2365.75, 2575.0, 0.24314467107929216, 292.5846811470012, 1.1955404481291367], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7cd8604f-46f5-4969-aa0a-9128d137c593", 3, 0, 0.0, 304.6666666666667, 202, 411, 301.0, 411.0, 411.0, 411.0, 0.03144357450554979, 0.02621321429320085, 0.020164010994769884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e592fa01-f9b6-414b-834d-2d05a70e539c", 3, 0, 0.0, 326.6666666666667, 206, 528, 246.0, 528.0, 528.0, 528.0, 0.02197544610155586, 0.025974233331624134, 0.014092327089864925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae472901-7730-4be6-a480-1b8318267983", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 567.6, 119, 1295, 484.0, 1124.0, 1295.0, 1295.0, 0.07303712720632989, 0.014307859099208764, 0.04917643031040779], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 567.6, 119, 1295, 484.0, 1124.0, 1295.0, 1295.0, 0.07187350263536177, 0.014079906863919502, 0.04839295340201246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f455f9f-d7ce-4ab7-bdce-e620030aa7b7", 3, 0, 0.0, 370.3333333333333, 326, 440, 345.0, 440.0, 440.0, 440.0, 0.03143401999203672, 0.025550373671912655, 0.02015788391416417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7304d1a9-543c-4ff8-9689-d7eb15e47e79", 3, 0, 0.0, 347.3333333333333, 244, 512, 286.0, 512.0, 512.0, 512.0, 0.07944915254237288, 0.03594867253707627, 0.05094883805614407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 190.44444444444443, 113, 345, 115.0, 343.2, 345.0, 345.0, 0.08913891805162133, 0.03872745528197611, 0.05000523072123289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 128.11111111111111, 113, 340, 116.0, 140.20000000000033, 340.0, 340.0, 0.08913715236510578, 0.0662435282713335, 0.04474267218326598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 252.77777777777777, 113, 905, 115.5, 902.3, 905.0, 905.0, 0.08903970676256573, 2.9302913391571894, 0.0515823561637737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 265.2777777777777, 113, 1023, 115.0, 1018.5, 1023.0, 1023.0, 0.08903882587468279, 8.923253555988108, 0.051494893870666164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58de49d2-04e6-4d24-ba7e-34335e7b3f30", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 230.53333333333333, 115, 345, 206.0, 340.2, 345.0, 345.0, 0.07320072615120342, 0.13040785614593298, 0.04731359435085596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0740749a-1c86-49ed-b1e0-2ee14a3e7aff", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 147.42105263157896, 114, 472, 115.0, 351.0, 472.0, 472.0, 0.10591094561751656, 0.07870920860833018, 0.05316233012441749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 140.31578947368422, 114, 341, 116.0, 340.0, 341.0, 341.0, 0.1059068131525114, 0.04508224848525387, 0.059463714374898974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 793.0, 676, 913, 793.0, 913.0, 913.0, 913.0, 0.05899879052479424, 17.34760335850615, 0.03364774772117172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1247.3333333333335, 1021, 1371, 1295.0, 1371.0, 1371.0, 1371.0, 0.058864503723179855, 52.96638392287769, 0.033513677412708845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 318.83333333333337, 114, 420, 344.5, 420.0, 420.0, 420.0, 0.059326642606417165, 0.10498034804963662, 0.032849810896326694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 136.5, 114, 358, 116.5, 286.90000000000026, 358.0, 358.0, 0.06317984141859805, 0.04695298761675108, 0.031713318837069716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 134.16666666666666, 113, 343, 115.0, 275.2000000000003, 343.0, 343.0, 0.06318017406137955, 0.016905632512517574, 0.03603244301938052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 172.33333333333331, 114, 350, 116.0, 346.7, 350.0, 350.0, 0.0631805067076638, 0.017029120948550008, 0.03714322757618516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 220.74999999999997, 115, 455, 117.5, 423.8000000000001, 455.0, 455.0, 0.0631805067076638, 0.017029120948550008, 0.03720492728976687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 191.16666666666666, 114, 344, 115.5, 344.0, 344.0, 344.0, 0.05946010227137591, 0.044188611160661195, 0.03338824102152456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 941.6666666666665, 115, 1472, 1247.0, 1470.8, 1472.0, 1472.0, 0.07906555061249447, 47.43598449458664, 0.041952098795041005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 247.15789473684205, 114, 1243, 116.0, 783.0, 1243.0, 1243.0, 0.1059068131525114, 10.056607452913275, 0.061303583970167726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 681.8000000000001, 113, 1131, 904.0, 1071.0, 1131.0, 1131.0, 0.07906555061249447, 15.505701614518543, 0.04202931124681102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 236.2105263157895, 113, 912, 116.0, 909.0, 912.0, 912.0, 0.10591212638103839, 3.3036134848434173, 0.06141008931458131], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 429.21428571428567, 117, 938, 412.5, 796.5, 938.0, 938.0, 0.0760051683514479, 0.014972000238873386, 0.05162795266506694], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0f10fe1-5bbd-4710-b5ea-d967f999cecd", 3, 0, 0.0, 415.0, 313, 479, 453.0, 479.0, 479.0, 479.0, 0.03750234389649353, 0.024110393618351145, 0.024049354647165448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=447c79d4-6d4d-44c5-ba2e-38f6ac2cc3d5", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 376.83333333333337, 232, 709, 346.0, 667.3000000000002, 709.0, 709.0, 0.06314094637755129, 0.09785613466911514, 0.1420054682690436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 613.9130434782609, 154, 2042, 445.0, 1298.0000000000007, 1929.9999999999984, 2042.0, 0.09931987477059268, 0.061008009014358204, 0.04490732619021915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 116.6, 114, 120, 116.0, 119.4, 120.0, 120.0, 0.07916026787834651, 0.05882906626506024, 0.039734743837373146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 139.13333333333333, 114, 460, 116.0, 256.0000000000001, 460.0, 460.0, 0.07916110340023326, 0.10044595737438453, 0.04071436958735956], "isController": false}, {"data": ["login", 23, 0, 0.0, 2656.478260869565, 1651, 4250, 2623.0, 3966.8, 4194.4, 4250.0, 0.09623269903432578, 30.164963243293002, 0.18682267739242858], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c20e00f8-1df8-4acf-b9d8-fc3a3da43b24", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17faf5e1-fe67-48e8-bc0a-da2961fd8c3d", 3, 0, 0.0, 453.0, 212, 810, 337.0, 810.0, 810.0, 810.0, 0.017449672236989813, 0.02405578187618876, 0.011190056740517557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 144.73684210526315, 115, 348, 119.0, 348.0, 348.0, 348.0, 0.10818382139420477, 0.08758241009355053, 0.038455967761221226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/633e1f16-e0b7-4a3b-98a0-adacfea0c8c1", 3, 0, 0.0, 685.6666666666667, 206, 1576, 275.0, 1576.0, 1576.0, 1576.0, 0.04020908725371934, 0.03352066160702319, 0.025785124313094758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae472901-7730-4be6-a480-1b8318267983", 3, 0, 0.0, 297.3333333333333, 205, 479, 208.0, 479.0, 479.0, 479.0, 0.039343746311523785, 0.03241504619611546, 0.025230201898991486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1059.5333333333333, 233, 1589, 1365.0, 1588.4, 1589.0, 1589.0, 0.07901682004709402, 63.06187852447941, 0.16423255078147636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 445.5, 231, 1139, 457.0, 1134.5, 1139.0, 1139.0, 0.0889868843219941, 11.951394313243721, 0.1976037964029524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 909.6, 115, 1488, 1354.5, 1487.4, 1488.0, 1488.0, 0.09540255106421545, 68.49098207386065, 0.15435834629217984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/badd79df-d11e-49aa-8270-c17837b38296", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45815b79-4947-4e35-9c75-e3959343cffe", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["register", 24, 6, 25.0, 1179.9999999999998, 205, 1894, 1058.5, 1839.5, 1893.0, 1894.0, 0.09756732145180173, 0.030775629715753868, 0.044019631358137114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7304d1a9-543c-4ff8-9689-d7eb15e47e79", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 438.5263157894737, 231, 1716, 241.0, 1024.0, 1716.0, 1716.0, 0.10583661055469525, 13.474905539084347, 0.23517856620637026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 133.05882352941174, 117, 344, 119.0, 174.39999999999986, 344.0, 344.0, 0.1035657063485778, 0.08040501615929624, 0.03681437217859602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f455f9f-d7ce-4ab7-bdce-e620030aa7b7", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 308.6111111111112, 229, 461, 234.0, 460.1, 461.0, 461.0, 0.18520233354940274, 0.2870274446708028, 0.41652438883229925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 116.9, 115, 120, 116.0, 120.0, 120.0, 120.0, 0.04816445270732388, 0.03579409034206394, 0.024176297550355934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 138.8, 113, 344, 115.5, 321.9000000000001, 344.0, 344.0, 0.04816514866173135, 0.012887940169252333, 0.02746918634614366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e592fa01-f9b6-414b-834d-2d05a70e539c", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 139.3, 114, 343, 115.5, 321.0000000000001, 343.0, 343.0, 0.04816514866173135, 0.012982012725232276, 0.028315839349963155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 161.6, 114, 342, 115.5, 341.9, 342.0, 342.0, 0.04811300783279768, 0.012967959142433748, 0.028332171604665037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.5, 117, 120, 118.5, 120.0, 120.0, 120.0, 0.03201998046781191, 0.009443392677030467, 0.019793601207153264], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1287.5185185185185, 902, 2045, 1354.5, 1733.0, 1845.5, 2045.0, 0.24786105093085592, 296.5279873567914, 0.48942875486542065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1179.9999999999998, 205, 1894, 1058.5, 1839.5, 1893.0, 1894.0, 0.09543160933480192, 0.030101962710098653, 0.043056058117850085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 115.66666666666667, 114, 117, 116.0, 117.0, 117.0, 117.0, 0.12027904738994467, 0.032418961991821024, 0.07082838435169593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 115.0, 114, 116, 115.0, 116.0, 116.0, 116.0, 0.12029351617947792, 0.03242286178274991, 0.07071943041020089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 210.52941176470586, 114, 1259, 116.0, 527.7999999999994, 1259.0, 1259.0, 0.10353227771010963, 5.506176965971377, 0.060342284561510355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 189.7058823529412, 115, 909, 116.0, 457.7999999999996, 909.0, 909.0, 0.10353164718850677, 1.8169542397732048, 0.06044302219535813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58de49d2-04e6-4d24-ba7e-34335e7b3f30", 3, 0, 0.0, 290.6666666666667, 198, 418, 256.0, 418.0, 418.0, 418.0, 0.06223549912870301, 0.0400114292901004, 0.03991013453240395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.12028386993304198, 0.03218533238442725, 0.06859939457118801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 156.64705882352945, 115, 344, 117.0, 344.0, 344.0, 344.0, 0.10353101667458375, 0.0769405309466389, 0.051967717354234416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 116.66666666666667, 116, 117, 117.0, 117.0, 117.0, 117.0, 0.12027904738994467, 0.08938706549194131, 0.06037444370940582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 155.94117647058823, 114, 345, 116.0, 340.2, 345.0, 345.0, 0.10339123242349049, 0.03679986650367343, 0.05845453294531212], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 641.9285714285713, 115, 2197, 479.0, 1886.5, 2197.0, 2197.0, 0.07619586691847587, 0.014711925197428935, 0.05185315831868377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 194.33333333333331, 117, 347, 119.0, 347.0, 347.0, 347.0, 0.1422812425895186, 0.11199089992885937, 0.05057653545174294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1370.782608695652, 765, 2113, 1325.0, 2017.8000000000002, 2101.3999999999996, 2113.0, 0.09834986038595905, 0.050903736332576464, 0.04523709398611984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 233.33333333333334, 232, 234, 234.0, 234.0, 234.0, 234.0, 0.11971746677840296, 0.18553869118879443, 0.2692473886627559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0f10fe1-5bbd-4710-b5ea-d967f999cecd", 1, 0, 0.0, 938.0, 938, 938, 938.0, 938.0, 938.0, 938.0, 1.0660980810234542, 0.1926056103411514, 0.7350246535181237], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1151.2931034482756, 586, 2419, 946.0, 2028.2, 2169.2999999999997, 2419.0, 0.27138565773589496, 85.05814229352465, 0.9856875868551082], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cd8604f-46f5-4969-aa0a-9128d137c593", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1801c7cc-f6c2-4c2f-a517-1a15bc0adf4f", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 202.37037037037032, 115, 471, 117.0, 462.0, 466.25, 471.0, 0.24916483638175743, 0.18517035203761467, 0.1204458925868847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0740749a-1c86-49ed-b1e0-2ee14a3e7aff", 3, 0, 0.0, 410.0, 200, 604, 426.0, 604.0, 604.0, 604.0, 0.06296171927468099, 0.028488538343687038, 0.040375842112995296], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 725.0000000000001, 565, 1029, 682.5, 918.0, 1020.5, 1029.0, 0.24895347336197834, 73.20058720171686, 0.12520609255997936], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 183.44444444444443, 113, 468, 119.0, 348.5, 354.75, 468.0, 0.24960479241201433, 0.4416834803228222, 0.12138983068474914], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1083.5185185185185, 785, 1581, 1043.5, 1358.5, 1369.5, 1581.0, 0.2484380607109009, 223.54500373519724, 0.12470426094277644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 146.44444444444446, 115, 344, 119.5, 341.3, 344.0, 344.0, 0.18589664146734414, 0.13887786203370925, 0.066080446771595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 181.49999999999997, 115, 852, 122.0, 344.9, 430.39999999999986, 763.959999999999, 0.7279173428447866, 1.592570078101249, 0.34975408035136996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 150.70000000000002, 117, 375, 121.0, 354.70000000000005, 375.0, 375.0, 0.047725179327361325, 0.0369590500064429, 0.01696480983902297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/447c79d4-6d4d-44c5-ba2e-38f6ac2cc3d5", 3, 0, 0.0, 954.6666666666666, 206, 2177, 481.0, 2177.0, 2177.0, 2177.0, 0.018335503034525753, 0.02527697114297414, 0.01175811880794783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f6b86f3-f416-447b-9684-e89a6e185847", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 127.44444444444446, 116, 179, 120.0, 165.50000000000003, 179.0, 179.0, 0.09157555746620608, 0.07431571118595434, 0.032552248943065444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1801c7cc-f6c2-4c2f-a517-1a15bc0adf4f", 3, 0, 0.0, 888.3333333333334, 214, 2197, 254.0, 2197.0, 2197.0, 2197.0, 0.08971023593792052, 0.04059154555784815, 0.05752902499925241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=633e1f16-e0b7-4a3b-98a0-adacfea0c8c1", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 302.4, 230, 461, 236.5, 460.9, 461.0, 461.0, 0.04808547674345917, 0.07452309725768526, 0.10814536419940086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 394.8823529411765, 230, 1603, 235.0, 871.7999999999994, 1603.0, 1603.0, 0.10331771412596252, 7.421521269774707, 0.23080897200393824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 120.5, 115, 130, 120.0, 129.1, 130.0, 130.0, 0.062336690856765874, 0.051683447790424046, 0.022158745577990992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17faf5e1-fe67-48e8-bc0a-da2961fd8c3d", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 120.53333333333335, 116, 129, 120.0, 127.8, 129.0, 129.0, 0.08180226755885674, 0.0635085963957921, 0.029078149796312354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/572dc24e-7abe-4c2e-9fe6-5817afdc5fb7", 2, 0, 0.0, 259.5, 194, 325, 259.5, 325.0, 325.0, 325.0, 0.018004393071909548, 0.025635161229339957, 0.011191207217060963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 116.88888888888887, 114, 128, 116.0, 119.9, 128.0, 128.0, 0.18542364151429305, 0.1378001867113057, 0.09307397630697914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 165.66666666666669, 114, 342, 116.0, 341.1, 342.0, 342.0, 0.18542746180709363, 0.04961633255385123, 0.1057515993118581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 152.88888888888886, 113, 343, 116.0, 341.2, 343.0, 343.0, 0.18542746180709363, 0.04997849556519321, 0.10901106641393592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 140.44444444444446, 113, 343, 115.0, 342.1, 343.0, 343.0, 0.18542937201252677, 0.04997901042525136, 0.10919327277690787], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.4662004662004662], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1554001554001554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1554001554001554], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1655011655011656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 25, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

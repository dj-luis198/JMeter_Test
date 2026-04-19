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

    var data = {"OkPercent": 98.10749432248296, "KoPercent": 1.8925056775170326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7519455252918288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7b48adf-bf5b-44c4-b093-0f362f5678e8"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/731a4074-094c-4523-92a3-0c010563396c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06352298-88a6-4f86-bc28-ce76865120a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3009d2d-6909-4097-890d-65a1b46ab7e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e3ff400-9bc2-44ec-996d-8e7a395c0dc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/18c1123c-998f-4ff6-a72e-c127fefb258a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a75494b3-0940-4f2a-83a3-0d12ff0fa091"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0656586-2d9e-4a7a-b62b-c0d5d58e66e5"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/659ba938-7154-4539-8bc4-e1da121810d9"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa125922-ad0b-4870-84e1-ecab6542a615"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61ba94f2-3a09-461c-bf41-9b768e4c6349"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2e3ff400-9bc2-44ec-996d-8e7a395c0dc1"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50928d17-29f7-444d-8569-48c84cdfd0d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0404b869-5395-499c-bcb6-0a56b9a1ab20"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0404b869-5395-499c-bcb6-0a56b9a1ab20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3009d2d-6909-4097-890d-65a1b46ab7e6"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/506cbe68-0a9e-415b-a5f1-a975c063f42e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7b48adf-bf5b-44c4-b093-0f362f5678e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=731a4074-094c-4523-92a3-0c010563396c"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a75494b3-0940-4f2a-83a3-0d12ff0fa091"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18c1123c-998f-4ff6-a72e-c127fefb258a"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9035087719298246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9298245614035088, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06352298-88a6-4f86-bc28-ce76865120a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0656586-2d9e-4a7a-b62b-c0d5d58e66e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86d76179-a3bd-48f8-b36f-83dc6f927e84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61ba94f2-3a09-461c-bf41-9b768e4c6349"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=659ba938-7154-4539-8bc4-e1da121810d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/256f9a46-e98f-4a37-b673-13181caf3c36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa125922-ad0b-4870-84e1-ecab6542a615"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50928d17-29f7-444d-8569-48c84cdfd0d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 25, 1.8925056775170326, 423.4852384557154, 123, 2276, 140.0, 1155.1999999999998, 1405.8999999999999, 1793.4599999999998, 5.142398903785367, 739.1696502908413, 3.7583765313332087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2031.0877192982457, 1506, 2902, 2011.0, 2588.4, 2669.499999999999, 2902.0, 0.2606310013717421, 313.62630208333337, 1.2815205975651578], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7b48adf-bf5b-44c4-b093-0f362f5678e8", 3, 0, 0.0, 385.0, 241, 543, 371.0, 543.0, 543.0, 543.0, 0.01805934300110162, 0.02489626224272961, 0.011581023994847067], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 501.8666666666667, 129, 922, 475.0, 902.2, 922.0, 922.0, 0.07712518445773282, 0.015108703127169146, 0.05192894906652818], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 501.8666666666667, 129, 922, 475.0, 902.2, 922.0, 922.0, 0.07852005402179717, 0.015381955895285657, 0.05286812491493661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/731a4074-094c-4523-92a3-0c010563396c", 3, 0, 0.0, 354.3333333333333, 298, 444, 321.0, 444.0, 444.0, 444.0, 0.08997120921305182, 0.04070962916866602, 0.057696380908109406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.0, 125, 385, 127.0, 376.6, 384.6, 385.0, 0.10141319284225685, 0.02713595199099451, 0.05783721154284961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 140.7, 126, 377, 128.0, 132.9, 364.79999999999984, 377.0, 0.10141216438911847, 0.07536587607433512, 0.05090415282813173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 177.25, 125, 380, 128.0, 377.20000000000005, 379.9, 380.0, 0.10141216438911847, 0.02733374743300459, 0.05971829602210785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 165.1, 125, 385, 127.0, 378.0, 384.65, 385.0, 0.1014126786130802, 0.027333886032431774, 0.05961956301276786], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 281.3333333333333, 126, 448, 279.0, 434.2, 448.0, 448.0, 0.07752819442003742, 0.14662721666029213, 0.0501106714975346], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/06352298-88a6-4f86-bc28-ce76865120a4", 3, 0, 0.0, 369.3333333333333, 326, 439, 343.0, 439.0, 439.0, 439.0, 0.06935614379840481, 0.03138184891920009, 0.04447643336030516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 128.7333333333333, 126, 139, 128.0, 134.2, 139.0, 139.0, 0.07578398532822044, 0.056319934408960694, 0.0380400082604544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 851.2857142857143, 733, 997, 752.0, 997.0, 997.0, 997.0, 0.030586651985073713, 8.993491256040864, 0.01744394996023735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 161.06666666666666, 124, 391, 127.0, 381.4, 391.0, 391.0, 0.07578436821098368, 0.04304315288233214, 0.04194783193553276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1366.857142857143, 1222, 1405, 1397.0, 1405.0, 1405.0, 1405.0, 0.030499494579804106, 27.443498835300552, 0.017364458339868938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 268.2857142857143, 126, 377, 367.0, 377.0, 377.0, 377.0, 0.03063765718212336, 0.05421429181055423, 0.016964405881117136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3009d2d-6909-4097-890d-65a1b46ab7e6", 3, 0, 0.0, 489.0, 413, 605, 449.0, 605.0, 605.0, 605.0, 0.017863948170731708, 0.024615264520412537, 0.01145572197146532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 148.30769230769232, 125, 388, 128.0, 285.5999999999999, 388.0, 388.0, 0.07274640045214686, 0.054062510492269296, 0.03651528303945653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e3ff400-9bc2-44ec-996d-8e7a395c0dc1", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 204.92307692307696, 123, 395, 128.0, 388.6, 395.0, 395.0, 0.0727476217123671, 0.027870558198097372, 0.04101890388919978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 254.38461538461536, 125, 1404, 127.0, 1045.1999999999998, 1404.0, 1404.0, 0.07274640045214686, 5.0532790877181695, 0.04228603115224702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c1123c-998f-4ff6-a72e-c127fefb258a", 3, 0, 0.0, 833.6666666666666, 425, 1571, 505.0, 1571.0, 1571.0, 1571.0, 0.025621535754853146, 0.025696598847884944, 0.016430477030293197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 254.0, 125, 985, 129.0, 750.5999999999998, 985.0, 985.0, 0.0726455845454901, 1.6611674599471364, 0.04229837183083637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a75494b3-0940-4f2a-83a3-0d12ff0fa091", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 0.18048357892107894, 0.6887643606393608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 162.42857142857144, 126, 371, 128.0, 371.0, 371.0, 371.0, 0.030669201987364288, 0.02279224874256272, 0.01722147572532663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 394.6666666666667, 126, 1405, 127.0, 1382.2, 1405.0, 1405.0, 0.07578589978072613, 13.654798502660086, 0.04325124983579722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 801.6470588235295, 126, 1538, 1125.0, 1519.6, 1538.0, 1538.0, 0.08779857972885732, 41.83536253227889, 0.047621449322143315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 261.59999999999997, 124, 1009, 128.0, 853.6000000000001, 1009.0, 1009.0, 0.07578551688248697, 4.4730329079660684, 0.04332504060840613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 605.2941176470588, 125, 1131, 749.0, 1122.2, 1131.0, 1131.0, 0.08779857972885732, 13.678270255003229, 0.04770719012265978], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 445.8, 129, 1001, 432.0, 850.4000000000001, 1001.0, 1001.0, 0.07835025698884292, 0.015348692921837784, 0.05327409400986168], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b0656586-2d9e-4a7a-b62b-c0d5d58e66e5", 3, 0, 0.0, 367.66666666666663, 209, 659, 235.0, 659.0, 659.0, 659.0, 0.07013934349574488, 0.03251250818292341, 0.04497868056204994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 483.2307692307692, 252, 1534, 262.0, 1278.3999999999996, 1534.0, 1534.0, 0.07259406515596556, 6.784447628966149, 0.16183699456382136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659ba938-7154-4539-8bc4-e1da121810d9", 3, 0, 0.0, 347.3333333333333, 229, 512, 301.0, 512.0, 512.0, 512.0, 0.016576417283677754, 0.022851929425903417, 0.01063005926069179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 589.2608695652175, 140, 1619, 533.0, 1181.0000000000002, 1543.7999999999988, 1619.0, 0.10011404295327722, 0.0614958330250111, 0.04526640809313218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 128.41176470588238, 126, 130, 128.0, 130.0, 130.0, 130.0, 0.08779721941041585, 0.0652477382532485, 0.0440700886493689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 186.23529411764704, 124, 378, 129.0, 378.0, 378.0, 378.0, 0.08779948663123699, 0.09330712906008068, 0.04616937618464749], "isController": false}, {"data": ["login", 23, 0, 0.0, 2718.739130434783, 1711, 4689, 2655.0, 3950.8, 4547.999999999998, 4689.0, 0.09884607946365258, 36.12426755189419, 0.199022585523347], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 134.80000000000004, 127, 151, 134.0, 146.2, 151.0, 151.0, 0.07148337534967285, 0.057870818520389444, 0.025410106081329018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa125922-ad0b-4870-84e1-ecab6542a615", 3, 0, 0.0, 375.6666666666667, 229, 573, 325.0, 573.0, 573.0, 573.0, 0.02236352657905134, 0.026432931317882623, 0.014341193802321335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61ba94f2-3a09-461c-bf41-9b768e4c6349", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e3ff400-9bc2-44ec-996d-8e7a395c0dc1", 3, 0, 0.0, 705.3333333333334, 226, 1140, 750.0, 1140.0, 1140.0, 1140.0, 0.04336701504835422, 0.03615329607383957, 0.02781022774910736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 932.1764705882356, 255, 1666, 1256.0, 1650.0, 1666.0, 1666.0, 0.08773967123429073, 55.63483442362778, 0.18544380306314676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1020.0909090909091, 126, 1593, 1499.0, 1582.0, 1593.0, 1593.0, 0.04790001959546256, 36.47152738465893, 0.08027420720024385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 357.45000000000005, 254, 763, 260.0, 514.6, 750.5999999999998, 763.0, 0.10134587319604345, 0.15706630933800875, 0.22792924411180476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50928d17-29f7-444d-8569-48c84cdfd0d8", 3, 0, 0.0, 357.3333333333333, 281, 412, 379.0, 412.0, 412.0, 412.0, 0.03050671656209642, 0.025432194373544575, 0.019563226441188134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0404b869-5395-499c-bcb6-0a56b9a1ab20", 3, 0, 0.0, 346.0, 229, 462, 347.0, 462.0, 462.0, 462.0, 0.03237328556475197, 0.026672130782678136, 0.02076021242270878], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1069.3333333333333, 261, 1885, 1013.0, 1578.0, 1847.25, 1885.0, 0.09931431740028222, 0.031181204144717513, 0.04480782679583045], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 524.8666666666667, 255, 1533, 260.0, 1512.0, 1533.0, 1533.0, 0.07573424349064177, 18.21479556803207, 0.16645262539066247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 149.71428571428572, 127, 383, 131.0, 262.5, 383.0, 383.0, 0.07605595545294037, 0.05904734822762461, 0.027035515414912403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0404b869-5395-499c-bcb6-0a56b9a1ab20", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3009d2d-6909-4097-890d-65a1b46ab7e6", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 427.7, 252, 1506, 259.5, 1204.6000000000013, 1494.1, 1506.0, 0.09588647041902389, 11.605100186379326, 0.2131975740722984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/506cbe68-0a9e-415b-a5f1-a975c063f42e", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.5287018832781457, 0.9878802773178809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 128.44444444444446, 126, 130, 129.0, 130.0, 130.0, 130.0, 0.054755849749948286, 0.040692579745811176, 0.02748486989401701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 162.22222222222223, 125, 444, 127.0, 444.0, 444.0, 444.0, 0.05475651602540702, 0.014651645889610864, 0.03122832554573994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 211.66666666666666, 128, 378, 130.0, 378.0, 378.0, 378.0, 0.05475618288565084, 0.014758502418398076, 0.032190646579259574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 130.5, 129, 132, 130.5, 132.0, 132.0, 132.0, 0.016813787305590584, 0.004958753678015973, 0.010393679066834804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 154.88888888888889, 124, 373, 127.0, 373.0, 373.0, 373.0, 0.05475551661829929, 0.014758322838525982, 0.032243727071127416], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1406.1754385964914, 988, 2276, 1265.0, 2043.2, 2138.8999999999996, 2276.0, 0.2785175050695072, 333.2037644145025, 0.549963276611859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1069.3333333333333, 261, 1885, 1013.0, 1578.0, 1847.25, 1885.0, 0.09560724543574994, 0.030017313874603133, 0.043135300186832495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 128.0, 126, 130, 127.5, 130.0, 130.0, 130.0, 0.03618643250024124, 0.009753374384830649, 0.021309002732075654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 128.16666666666666, 127, 129, 128.0, 129.0, 129.0, 129.0, 0.03618599601954044, 0.009753256739641758, 0.02127340781617514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 180.57142857142856, 125, 387, 127.0, 381.0, 387.0, 387.0, 0.07564827873148644, 0.020389575126845954, 0.04447291386362776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 161.85714285714283, 124, 376, 127.0, 372.0, 376.0, 376.0, 0.07564868749527195, 0.020389685301460018, 0.044547029843407214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 128.57142857142858, 126, 134, 128.0, 133.0, 134.0, 134.0, 0.07564746121716764, 0.05621847459596151, 0.037971479556273606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 128.0, 126, 130, 128.0, 130.0, 130.0, 130.0, 0.03618643250024124, 0.009682697758853614, 0.020637574785293836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7b48adf-bf5b-44c4-b093-0f362f5678e8", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 164.00000000000003, 124, 387, 128.0, 382.5, 387.0, 387.0, 0.07564746121716764, 0.02024160583349994, 0.04314269272541593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 131.83333333333334, 127, 141, 129.5, 141.0, 141.0, 141.0, 0.03618294094944037, 0.02688986138918371, 0.01816214028126206], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 467.79999999999995, 127, 750, 482.0, 695.4000000000001, 750.0, 750.0, 0.0784506519249175, 0.01508234213113811, 0.05338832451635173], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 137.5, 130, 163, 132.5, 163.0, 163.0, 163.0, 0.03720814858454002, 0.029286882577284425, 0.013226334067160709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=731a4074-094c-4523-92a3-0c010563396c", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1313.869565217391, 723, 1866, 1306.0, 1723.2, 1838.7999999999997, 1866.0, 0.09823476400165718, 0.05084416496179522, 0.04518415414529348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 261.16666666666663, 255, 272, 258.0, 272.0, 272.0, 272.0, 0.036155032780563055, 0.05603323928003278, 0.08131351610706711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a75494b3-0940-4f2a-83a3-0d12ff0fa091", 3, 0, 0.0, 649.6666666666666, 448, 969, 532.0, 969.0, 969.0, 969.0, 0.04211117349803481, 0.02707342697220663, 0.027004886650758002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18c1123c-998f-4ff6-a72e-c127fefb258a", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1252.122807017544, 634, 3154, 1012.0, 2196.0, 2458.699999999997, 3154.0, 0.2700449127328545, 86.10949817838124, 0.980550622169266], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 231.49122807017545, 125, 534, 131.0, 511.4, 519.3, 534.0, 0.27972027972027974, 0.20787805944055943, 0.13521634615384615], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 808.3859649122805, 616, 1283, 753.0, 1027.2, 1123.6999999999998, 1283.0, 0.27943505096012905, 82.16318309920435, 0.14053618285592426], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 212.98245614035088, 125, 511, 133.0, 385.0, 396.69999999999993, 511.0, 0.28028421803161807, 0.4959716826887616, 0.13631009822240797], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1171.4561403508774, 857, 1767, 1131.0, 1564.4, 1660.3, 1767.0, 0.27925434191509685, 251.27354773197706, 0.14017258959410137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 165.8, 127, 471, 133.0, 370.70000000000044, 466.99999999999994, 471.0, 0.09556437933324734, 0.07139331073235762, 0.03397015046611526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, 5.847953216374269, 201.80116959064324, 125, 1616, 135.0, 367.0000000000001, 424.8, 1364.7200000000005, 0.72948795065078, 1.6441432929235402, 0.3481590227741019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 160.88888888888889, 128, 389, 133.0, 389.0, 389.0, 389.0, 0.05462192524079165, 0.042299987027292756, 0.01941638748793766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06352298-88a6-4f86-bc28-ce76865120a4", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0656586-2d9e-4a7a-b62b-c0d5d58e66e5", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 161.09999999999997, 125, 419, 132.5, 355.9000000000005, 417.0, 419.0, 0.10519837784101368, 0.08537094920496327, 0.03739473587317284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 376.1111111111111, 257, 575, 261.0, 575.0, 575.0, 575.0, 0.05471257659760724, 0.08479380767617449, 0.12304986709403268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 328.8571428571429, 254, 516, 257.5, 511.5, 516.0, 516.0, 0.07559558521782328, 0.11715839232488823, 0.1700162429264131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86d76179-a3bd-48f8-b36f-83dc6f927e84", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61ba94f2-3a09-461c-bf41-9b768e4c6349", 3, 0, 0.0, 327.0, 220, 482, 279.0, 482.0, 482.0, 482.0, 0.04974959371165136, 0.030947745306954995, 0.03190322252993267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 155.23076923076923, 128, 377, 132.0, 291.79999999999995, 377.0, 377.0, 0.07414885668166755, 0.061476932932359125, 0.02635760139856151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 133.8235294117647, 128, 155, 130.0, 149.4, 155.0, 155.0, 0.08467020953386559, 0.06573517244084291, 0.030097613545241285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=659ba938-7154-4539-8bc4-e1da121810d9", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/256f9a46-e98f-4a37-b673-13181caf3c36", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa125922-ad0b-4870-84e1-ecab6542a615", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50928d17-29f7-444d-8569-48c84cdfd0d8", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 128.75, 123, 135, 128.0, 134.0, 134.95, 135.0, 0.09594580980662122, 0.07130347779574096, 0.04816029906308917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 172.85, 123, 509, 129.0, 376.90000000000003, 502.44999999999993, 509.0, 0.09594857156564081, 0.040084764566192525, 0.05391485163952122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 278.3499999999999, 123, 1378, 129.0, 1063.3000000000015, 1366.0499999999997, 1378.0, 0.09594903187426838, 8.656785890335055, 0.055582974324039074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 239.3, 125, 1001, 129.0, 932.1000000000013, 1000.65, 1001.0, 0.09594857156564081, 2.8444816078581883, 0.05567640744560916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1514004542013626], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1514004542013626], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0598031794095382], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

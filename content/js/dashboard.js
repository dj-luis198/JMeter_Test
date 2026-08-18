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

    var data = {"OkPercent": 96.82299546142208, "KoPercent": 3.177004538577912};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7054263565891473, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4463aa1-c74c-4689-b617-90bae26db0e6"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=872b4cf9-c49f-4cc4-897e-7abcd1c06da7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18cdb246-48b6-4be8-ba30-18588c531c6e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7ead6333-6bdb-4ab9-aabc-3111b1e3ba77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c6915c9-2aac-4663-a29f-76c0dc53707a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d4c9165-159e-4144-9186-593701c5711c"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8936f17d-c020-4176-b73c-ea14e55aaa5f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d4c9165-159e-4144-9186-593701c5711c"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6041666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7cac59fc-e596-45e4-bad0-00983374b842"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2aae54d6-7913-41de-9fd7-c875af22d00b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a892ed2-68fc-4bfb-a820-26571039b754"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1c7c436-a7b8-478d-8a34-acf864045aaa"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4463aa1-c74c-4689-b617-90bae26db0e6"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/872b4cf9-c49f-4cc4-897e-7abcd1c06da7"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ead6333-6bdb-4ab9-aabc-3111b1e3ba77"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18cdb246-48b6-4be8-ba30-18588c531c6e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e40e163-8b3b-4ad1-a855-a7a4ac5cc727"], "isController": false}, {"data": [0.23214285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c6915c9-2aac-4663-a29f-76c0dc53707a"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9bb457b-2aba-4888-9403-898a55b3a6e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8869047619047619, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9bb457b-2aba-4888-9403-898a55b3a6e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1c7c436-a7b8-478d-8a34-acf864045aaa"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e40e163-8b3b-4ad1-a855-a7a4ac5cc727"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a892ed2-68fc-4bfb-a820-26571039b754"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cac59fc-e596-45e4-bad0-00983374b842"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2aae54d6-7913-41de-9fd7-c875af22d00b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa63c574-9845-4b7c-8416-e4199545eadd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 42, 3.177004538577912, 496.7791225416027, 139, 2792, 159.0, 1399.2000000000003, 1687.0, 2160.1699999999996, 5.089979439871249, 740.2662858827669, 3.724086874244396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2386.1607142857156, 1734, 3238, 2383.0, 2837.6000000000004, 2891.95, 3238.0, 0.25321149037570256, 304.6973027606835, 1.2450389199625609], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4463aa1-c74c-4689-b617-90bae26db0e6", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 572.3125000000001, 147, 1000, 609.5, 978.3000000000001, 1000.0, 1000.0, 0.08757238404869025, 0.01832263992424989, 0.05847423593094918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 572.3125000000001, 147, 1000, 609.5, 978.3000000000001, 1000.0, 1000.0, 0.08593556980653755, 0.017980171710010418, 0.057381294780488326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=872b4cf9-c49f-4cc4-897e-7abcd1c06da7", 1, 0, 0.0, 1174.0, 1174, 1174, 1174.0, 1174.0, 1174.0, 1174.0, 0.8517887563884157, 0.153887617120954, 0.587268419931857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18cdb246-48b6-4be8-ba30-18588c531c6e", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ead6333-6bdb-4ab9-aabc-3111b1e3ba77", 3, 0, 0.0, 757.3333333333334, 300, 1451, 521.0, 1451.0, 1451.0, 1451.0, 0.0745675084509843, 0.033739855711871145, 0.04781835665639292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 223.0, 141, 434, 143.5, 434.0, 434.0, 434.0, 0.08858485691084918, 0.031095053396983194, 0.05010773210462856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 160.05555555555551, 142, 421, 144.5, 178.90000000000038, 421.0, 421.0, 0.08858442095316836, 0.06583275814976673, 0.044465226923758344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 278.38888888888897, 141, 1153, 144.0, 506.80000000000103, 1153.0, 1153.0, 0.0884651299945938, 1.467613084852804, 0.05167185273013221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 229.7777777777778, 141, 1410, 143.0, 530.7000000000014, 1410.0, 1410.0, 0.08858572883908403, 4.450860950241888, 0.05165578415595025], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 290.37499999999994, 143, 479, 275.0, 471.3, 479.0, 479.0, 0.08781173164734808, 0.13481544786727256, 0.05674747404065683], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c6915c9-2aac-4663-a29f-76c0dc53707a", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 144.375, 142, 148, 144.0, 148.0, 148.0, 148.0, 0.07448650863112419, 0.055355696355747566, 0.03738873577773226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 179.625, 141, 433, 143.5, 430.2, 433.0, 433.0, 0.07438988669490383, 0.026888239075147733, 0.04203500799691282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1024.6000000000001, 705, 1264, 1139.0, 1253.0, 1264.0, 1264.0, 0.05589996142902662, 16.43644471354065, 0.03188044675249174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1560.4, 1051, 1961, 1567.0, 1935.3000000000002, 1961.0, 1961.0, 0.05577120421184134, 50.183027585134745, 0.03175255083545264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 301.5, 141, 576, 287.0, 561.9000000000001, 576.0, 576.0, 0.056123651629269605, 0.09931255542210599, 0.031076279759566276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 145.00000000000003, 142, 148, 146.0, 148.0, 148.0, 148.0, 0.035074181894707304, 0.02606587150573463, 0.017605595208866752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 186.42857142857142, 142, 434, 145.0, 434.0, 434.0, 434.0, 0.035074181894707304, 0.01691076627066245, 0.01958243246967336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 307.4285714285714, 141, 1285, 146.0, 1285.0, 1285.0, 1285.0, 0.035074181894707304, 4.516647435889406, 0.02018918450021796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 329.5714285714286, 141, 1147, 146.0, 1147.0, 1147.0, 1147.0, 0.035074181894707304, 1.4813850825746453, 0.02022343663097451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 172.79999999999998, 143, 426, 144.5, 398.2000000000001, 426.0, 426.0, 0.05621419858227791, 0.041776372188587395, 0.03156559002422832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 224.43749999999997, 142, 1142, 143.5, 647.1000000000005, 1142.0, 1142.0, 0.07448928285442932, 4.2079215933373995, 0.04339146213151083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 780.3000000000001, 142, 1837, 287.0, 1719.8, 1831.1999999999998, 1837.0, 0.12640307412276267, 51.200706998069194, 0.06942293836586107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 294.5625, 141, 1123, 148.5, 641.4000000000005, 1123.0, 1123.0, 0.07439127018444386, 1.3858915648436156, 0.04340701556172383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 627.0000000000001, 142, 1265, 427.0, 1157.0, 1259.6499999999999, 1265.0, 0.12640147636924398, 16.743541970820218, 0.06954549979143756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d4c9165-159e-4144-9186-593701c5711c", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 507.56249999999994, 148, 1174, 411.0, 1103.3000000000002, 1174.0, 1174.0, 0.08632829571757697, 0.018062341169424675, 0.05798074744117536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8936f17d-c020-4176-b73c-ea14e55aaa5f", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.8003406954887218, 1.495437813283208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d4c9165-159e-4144-9186-593701c5711c", 3, 0, 0.0, 371.3333333333333, 244, 542, 328.0, 542.0, 542.0, 542.0, 0.07209112317969915, 0.03261935586581439, 0.046230310111981546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 496.2857142857143, 287, 1430, 294.0, 1430.0, 1430.0, 1430.0, 0.03504836674610963, 6.036562878647534, 0.07754353351374897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 818.875, 233, 1620, 640.5, 1559.5, 1617.5, 1620.0, 0.10900618155887924, 0.066957898633335, 0.04928697466968856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 159.54999999999998, 142, 426, 146.0, 151.5, 412.2999999999998, 426.0, 0.12639907981469894, 0.09393525365135341, 0.06344641311011255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 264.9, 142, 570, 146.0, 435.6, 563.3, 570.0, 0.12640147636924398, 0.11925436164094397, 0.06731125494545777], "isController": false}, {"data": ["login", 24, 0, 0.0, 3599.7500000000005, 2033, 5165, 3544.0, 4957.5, 5163.0, 5165.0, 0.10564682267180814, 52.80189164212579, 0.2323920586603983], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7cac59fc-e596-45e4-bad0-00983374b842", 3, 0, 0.0, 509.0, 421, 647, 459.0, 647.0, 647.0, 647.0, 0.025964584307005243, 0.026040652425092174, 0.016650465847916775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 147.93749999999997, 144, 152, 147.5, 152.0, 152.0, 152.0, 0.07218131947451999, 0.05843585336364949, 0.02565820340695828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aae54d6-7913-41de-9fd7-c875af22d00b", 3, 0, 0.0, 444.33333333333337, 244, 814, 275.0, 814.0, 814.0, 814.0, 0.021608850985363606, 0.02554093031505705, 0.013857238424858823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a892ed2-68fc-4bfb-a820-26571039b754", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c7c436-a7b8-478d-8a34-acf864045aaa", 3, 0, 0.0, 492.0, 280, 905, 291.0, 905.0, 905.0, 905.0, 0.03787209331683793, 0.024348106868735325, 0.024286466091852452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 970.55, 289, 1983, 716.0, 1873.3, 1977.6, 1983.0, 0.12628175986260542, 68.09224098229845, 0.2694709701911906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4463aa1-c74c-4689-b617-90bae26db0e6", 3, 0, 0.0, 464.3333333333333, 398, 505, 490.0, 505.0, 505.0, 505.0, 0.02197898808738846, 0.02597841983896728, 0.014094598480519291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 502.8888888888888, 287, 1554, 431.5, 925.800000000001, 1554.0, 1554.0, 0.08840213147361442, 6.004932524310586, 0.19756188149203152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, 44.44444444444444, 1027.5555555555557, 143, 2131, 1308.0, 2108.5, 2131.0, 2131.0, 0.09727731601076535, 64.6657291340157, 0.15050751399712492], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 1114.615384615384, 262, 2193, 1099.0, 1733.5, 2060.3499999999995, 2193.0, 0.10090856519663587, 0.031215555249379995, 0.045527106563325946], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/872b4cf9-c49f-4cc4-897e-7abcd1c06da7", 3, 0, 0.0, 549.3333333333334, 270, 776, 602.0, 776.0, 776.0, 776.0, 0.020914522347167126, 0.02472025737062625, 0.013411982104140378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 459.9375, 287, 1289, 298.0, 794.1000000000005, 1289.0, 1289.0, 0.07433804295809657, 5.666392823416948, 0.16599924558501716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 151.57142857142858, 144, 171, 149.0, 165.5, 171.0, 171.0, 0.10674148736638253, 0.0828705883362052, 0.037943263087268794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 512.0555555555554, 287, 1976, 302.0, 967.1000000000016, 1976.0, 1976.0, 0.09580889319437495, 6.5080550578446195, 0.21411457945218604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 169.69230769230768, 143, 430, 145.0, 331.5999999999999, 430.0, 430.0, 0.06899479885362488, 0.05127445500743021, 0.03463215489332343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 167.15384615384616, 141, 430, 145.0, 318.39999999999986, 430.0, 430.0, 0.06899443268000913, 0.018461400931955568, 0.03934838738781771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 166.38461538461536, 141, 430, 144.0, 318.7999999999999, 430.0, 430.0, 0.06899553121251685, 0.01859645177212368, 0.040561825966733536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 189.23076923076923, 141, 427, 145.0, 425.4, 427.0, 427.0, 0.06899150343100054, 0.018595366159136862, 0.04062683258680989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 150.75, 148, 153, 151.0, 153.0, 153.0, 153.0, 0.030588523186100575, 0.009021224611525755, 0.018908725758595375], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1620.4821428571427, 1129, 2636, 1432.0, 2251.4, 2297.15, 2636.0, 0.24374107733556183, 291.59906660224937, 0.4812934163794004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 1114.615384615384, 262, 2193, 1099.0, 1733.5, 2060.3499999999995, 2193.0, 0.10076308660587294, 0.0311705521817146, 0.045461470714759075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 144.83333333333334, 143, 148, 144.5, 148.0, 148.0, 148.0, 0.050357961174011937, 0.013573044222682904, 0.029654150964774605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 143.5, 142, 145, 143.5, 145.0, 145.0, 145.0, 0.05035880649628604, 0.013573272063452097, 0.02960547022535566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 325.6428571428571, 142, 1269, 144.0, 851.0, 1269.0, 1269.0, 0.11076124622225036, 7.1465186479414236, 0.06443560222471875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 254.78571428571428, 142, 1124, 145.0, 774.5, 1124.0, 1124.0, 0.11076212251873067, 2.3539886973187656, 0.06454427814742439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 165.42857142857142, 141, 418, 146.5, 285.5, 418.0, 418.0, 0.11100891242982651, 0.08249783433505661, 0.05572127049700276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 288.5, 143, 436, 287.5, 436.0, 436.0, 436.0, 0.05023484791399794, 0.013441746414487732, 0.028649561700951953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 214.28571428571428, 139, 570, 144.0, 498.0, 570.0, 570.0, 0.11100891242982651, 0.04161285542674998, 0.06264384078943196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 144.66666666666666, 143, 146, 144.5, 146.0, 146.0, 146.0, 0.050357961174011937, 0.037424227005295976, 0.02527733597992396], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 533.0, 143, 1118, 521.0, 968.9000000000001, 1118.0, 1118.0, 0.0865313892614546, 0.017513310961363736, 0.05887768112101415], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 150.0, 147, 155, 148.5, 155.0, 155.0, 155.0, 0.05095368310206023, 0.040106121660410686, 0.01811244204018547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1743.8333333333328, 1095, 2792, 1678.5, 2676.0, 2771.25, 2792.0, 0.10631605992681911, 0.05502686695431067, 0.0489012345952459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ead6333-6bdb-4ab9-aabc-3111b1e3ba77", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 433.8333333333333, 288, 581, 433.5, 581.0, 581.0, 581.0, 0.0501743558867063, 0.07776045194551065, 0.11284330235066857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18cdb246-48b6-4be8-ba30-18588c531c6e", 3, 0, 0.0, 535.3333333333334, 447, 691, 468.0, 691.0, 691.0, 691.0, 0.0335360400643892, 0.02763011634211232, 0.02150585902566625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e40e163-8b3b-4ad1-a855-a7a4ac5cc727", 3, 0, 0.0, 359.6666666666667, 233, 521, 325.0, 521.0, 521.0, 521.0, 0.07542236524537409, 0.03412665614943684, 0.04836655583769107], "isController": false}, {"data": ["addBook", 56, 15, 26.785714285714285, 1364.357142857143, 725, 4297, 1139.5, 2464.0, 2749.8999999999996, 4297.0, 0.2592136568566641, 78.6088784510711, 0.9409242384441625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c6915c9-2aac-4663-a29f-76c0dc53707a", 3, 0, 0.0, 775.0, 386, 1434, 505.0, 1434.0, 1434.0, 1434.0, 0.018776874401487127, 0.02219362986712232, 0.012041159691057828], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 245.35714285714297, 142, 614, 147.0, 577.3, 586.45, 614.0, 0.24516134681137025, 0.18219510246430934, 0.11851061198401198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9bb457b-2aba-4888-9403-898a55b3a6e5", 3, 0, 0.0, 643.0, 332, 1118, 479.0, 1118.0, 1118.0, 1118.0, 0.03161755406601745, 0.02635825389422874, 0.020275579918637494], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 902.4464285714286, 702, 1283, 847.5, 1156.4, 1277.15, 1283.0, 0.24491902364780643, 72.01432502941215, 0.12317704802599641], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 218.03571428571433, 141, 580, 147.0, 440.20000000000005, 490.45, 580.0, 0.2456711428533826, 0.43472276450227465, 0.1194767862704927], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1370.5892857142856, 981, 2019, 1283.5, 1734.0000000000002, 1844.8, 2019.0, 0.24439740764178322, 219.90921700089467, 0.12267604250769197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 149.3888888888889, 144, 164, 148.0, 160.4, 164.0, 164.0, 0.09600460822119461, 0.07172219266524793, 0.03412663807862777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 15, 8.928571428571429, 226.25, 143, 2165, 151.0, 422.29999999999995, 474.8499999999992, 1445.3300000000024, 0.6915828602714462, 1.5842221146483837, 0.32902768544094585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 194.6153846153846, 147, 434, 154.0, 431.6, 434.0, 434.0, 0.06934886747964877, 0.05370473819468895, 0.0246513552369064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 181.44444444444446, 143, 433, 149.0, 428.5, 433.0, 433.0, 0.08663676094029764, 0.07030776205213607, 0.030796661115496428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9bb457b-2aba-4888-9403-898a55b3a6e5", 1, 0, 0.0, 973.0, 973, 973, 973.0, 973.0, 973.0, 973.0, 1.027749229188078, 0.18567735097636176, 0.7085849177800617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1c7c436-a7b8-478d-8a34-acf864045aaa", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 360.99999999999994, 286, 861, 293.0, 745.8, 861.0, 861.0, 0.0689377227218734, 0.10684000581993468, 0.1550425541293696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e40e163-8b3b-4ad1-a855-a7a4ac5cc727", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 492.8571428571428, 288, 1413, 296.5, 1132.0, 1413.0, 1413.0, 0.1106352041219516, 9.613370400242607, 0.24679923464146292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a892ed2-68fc-4bfb-a820-26571039b754", 3, 0, 0.0, 369.3333333333333, 254, 590, 264.0, 590.0, 590.0, 590.0, 0.10091496232508074, 0.04467589477933261, 0.06471434758476856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cac59fc-e596-45e4-bad0-00983374b842", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 150.14285714285714, 144, 163, 149.0, 163.0, 163.0, 163.0, 0.03617458890163613, 0.02999240818114167, 0.012858935898628467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2aae54d6-7913-41de-9fd7-c875af22d00b", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 0.16837284482758622, 0.6425471808014912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 181.89999999999998, 143, 439, 150.5, 410.90000000000055, 438.9, 439.0, 0.1334258419170625, 0.10358744562896943, 0.047428717243955816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa63c574-9845-4b7c-8416-e4199545eadd", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 161.38888888888889, 142, 429, 145.0, 183.30000000000038, 429.0, 429.0, 0.0960256068284876, 0.07136278007468659, 0.048200353427580694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 222.00000000000003, 142, 436, 144.0, 425.20000000000005, 436.0, 436.0, 0.09588289502421042, 0.03365681048213116, 0.05423584329006174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 315.94444444444446, 140, 1833, 144.5, 573.900000000002, 1833.0, 1833.0, 0.09588442730362337, 4.817573426496596, 0.055911774341327256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 263.8333333333333, 140, 1156, 145.5, 505.30000000000103, 1156.0, 1156.0, 0.09602868056592902, 1.593090386328717, 0.05608966878107595], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 26.19047619047619, 0.8320726172465961], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.523809523809524, 0.30257186081694404], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.523809523809524, 0.30257186081694404], "isController": false}, {"data": ["401/Unauthorized", 23, 54.76190476190476, 1.739788199697428], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 42, "401/Unauthorized", 23, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

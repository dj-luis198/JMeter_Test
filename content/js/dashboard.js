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

    var data = {"OkPercent": 98.2089552238806, "KoPercent": 1.791044776119403};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.820627802690583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b41de0ef-9836-4755-b7ba-7f701bc2b255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=466abe5b-8bba-45e7-83e1-eae631a9a6f9"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5baeb908-053d-46e6-aa8e-d0afc940606e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afb5f741-3ec8-4c8a-a11d-8dcd36be8e8e"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16de84a5-e9c9-439d-ac28-b4f078a110de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fdf608a-3436-42fb-a566-70ba9063bef6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=287d6973-875c-4ec6-8439-40d064fd21fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e586c643-75cf-4e6d-82cb-ff56e6ad6328"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/514a6cab-4eb1-4dad-91ed-cbdc480d3374"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78647a51-8aad-4a00-b6f9-9c1356a05a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db574084-89d7-4095-846e-7da58500e8b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8361f717-355f-4b28-86a1-16c294098332"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afb5f741-3ec8-4c8a-a11d-8dcd36be8e8e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9d4f609-e713-431c-b4be-cc7b0945fda0"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06674601-7446-4162-ae10-595c885ca617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/466abe5b-8bba-45e7-83e1-eae631a9a6f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f826bf4-aa7d-4b3e-afdb-9ff4f3c2325d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e586c643-75cf-4e6d-82cb-ff56e6ad6328"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db574084-89d7-4095-846e-7da58500e8b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcfe5f7a-b39a-4fa1-9da4-df5eb96640e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5baeb908-053d-46e6-aa8e-d0afc940606e"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/287d6973-875c-4ec6-8439-40d064fd21fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fdf608a-3436-42fb-a566-70ba9063bef6"], "isController": false}, {"data": [0.3728813559322034, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b41de0ef-9836-4755-b7ba-7f701bc2b255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78647a51-8aad-4a00-b6f9-9c1356a05a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9431818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8361f717-355f-4b28-86a1-16c294098332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcfe5f7a-b39a-4fa1-9da4-df5eb96640e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=514a6cab-4eb1-4dad-91ed-cbdc480d3374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 24, 1.791044776119403, 292.51417910447753, 77, 2016, 92.0, 824.9000000000001, 994.5000000000005, 1400.079999999999, 5.24739098936816, 743.6035337898694, 3.837387936140426], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1334.5000000000002, 972, 1922, 1351.0, 1550.1, 1627.9499999999996, 1922.0, 0.2667243036426262, 320.9589444687473, 1.3114813172271709], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b41de0ef-9836-4755-b7ba-7f701bc2b255", 3, 0, 0.0, 832.0, 169, 1526, 801.0, 1526.0, 1526.0, 1526.0, 0.023649234553108297, 0.023718519419963106, 0.01516568752266385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=466abe5b-8bba-45e7-83e1-eae631a9a6f9", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.554184240797546, 2.114886886503067], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 453.1333333333333, 81, 806, 454.0, 780.8000000000001, 806.0, 806.0, 0.07559645603814094, 0.014809227618409249, 0.0508996450746389], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 453.1333333333333, 81, 806, 454.0, 780.8000000000001, 806.0, 806.0, 0.07460051424621154, 0.01461412417752933, 0.05022907020405727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 103.92857142857142, 78, 245, 80.5, 243.5, 245.0, 245.0, 0.10902153175252112, 0.029171777050967566, 0.062176342327609706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 97.5, 79, 237, 82.0, 186.0, 237.0, 237.0, 0.10901643812149103, 0.08101709903364715, 0.05472114179145156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 103.78571428571428, 78, 241, 81.0, 240.5, 241.0, 241.0, 0.10888417057483066, 0.029347686600247322, 0.06411831528967078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 113.57142857142858, 78, 240, 81.0, 238.5, 240.0, 240.0, 0.10888501742160278, 0.029347914851916377, 0.06401248094512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5baeb908-053d-46e6-aa8e-d0afc940606e", 3, 0, 0.0, 266.6666666666667, 183, 420, 197.0, 420.0, 420.0, 420.0, 0.021186291057266545, 0.025041478785460553, 0.013586260866801788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afb5f741-3ec8-4c8a-a11d-8dcd36be8e8e", 3, 0, 0.0, 304.0, 183, 425, 304.0, 425.0, 425.0, 425.0, 0.03098533360875852, 0.025528606563726505, 0.019870152086345797], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 193.93333333333334, 78, 304, 193.0, 297.4, 304.0, 304.0, 0.07616030220407914, 0.15755662518468874, 0.04922652866419907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/16de84a5-e9c9-439d-ac28-b4f078a110de", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.9706259498480243, 1.8136160714285714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 116.05882352941175, 80, 332, 82.0, 262.3999999999999, 332.0, 332.0, 0.09078820180615116, 0.06747052888132914, 0.04557142160972823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 564.8333333333333, 462, 707, 549.5, 707.0, 707.0, 707.0, 0.026022353201400002, 7.651435864657741, 0.01484087331017344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 118.35294117647061, 79, 243, 81.0, 241.4, 243.0, 243.0, 0.09079305059309226, 0.04835898237012588, 0.050434788559007473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 844.3333333333334, 695, 926, 869.0, 926.0, 926.0, 926.0, 0.025996646432610192, 23.391828157292707, 0.014800825068566155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 107.16666666666666, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.02606553744966093, 0.046123783065220324, 0.014432773177693113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 81.53333333333333, 78, 86, 81.0, 84.8, 86.0, 86.0, 0.0781710068946828, 0.05809388305356798, 0.03923818119518258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 101.26666666666667, 77, 236, 81.0, 234.2, 236.0, 236.0, 0.07817019214233228, 0.03657102869367186, 0.04370609440874672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 179.2, 78, 928, 82.0, 697.0000000000001, 928.0, 928.0, 0.07817059951638455, 9.396665877360752, 0.04506005782018677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 174.06666666666666, 78, 635, 80.0, 626.0, 635.0, 635.0, 0.07817019214233228, 3.08287766625497, 0.04513616107489225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fdf608a-3436-42fb-a566-70ba9063bef6", 3, 0, 0.0, 234.0, 159, 353, 190.0, 353.0, 353.0, 353.0, 0.02983085902930385, 0.024577442774468765, 0.019129815197828314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=287d6973-875c-4ec6-8439-40d064fd21fe", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.83333333333333, 79, 87, 81.5, 87.0, 87.0, 87.0, 0.02606599039902687, 0.019371307318026804, 0.014636664530703565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 493.4000000000001, 80, 1170, 239.0, 1037.4, 1163.3999999999999, 1170.0, 0.10703715794938212, 43.35636771578691, 0.05878681409251221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 252.9411764705883, 80, 967, 83.0, 887.8, 967.0, 967.0, 0.0907920807942705, 14.436895289693496, 0.051998911162619295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 326.0, 77, 727, 163.5, 714.9000000000002, 726.8, 727.0, 0.10703830365696364, 14.178634468875938, 0.05889197293001301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 153.88235294117644, 78, 469, 81.0, 467.4, 469.0, 469.0, 0.09079256569109165, 4.731216870727408, 0.05208785349017304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e586c643-75cf-4e6d-82cb-ff56e6ad6328", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 419.42857142857144, 83, 814, 447.0, 764.0, 814.0, 814.0, 0.07761263533703286, 0.015288649706457925, 0.0527198551138411], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 278.40000000000003, 161, 1009, 166.0, 833.2, 1009.0, 1009.0, 0.0781372089388967, 12.568853328319529, 0.1730667959186331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/514a6cab-4eb1-4dad-91ed-cbdc480d3374", 3, 0, 0.0, 256.3333333333333, 174, 395, 200.0, 395.0, 395.0, 395.0, 0.0896030584510618, 0.04054305053612496, 0.057460294644723874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 539.4545454545455, 98, 1039, 521.0, 963.0, 1028.4999999999998, 1039.0, 0.09213000381083199, 0.05659157460645831, 0.04165643726993672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 98.75, 79, 245, 83.0, 227.30000000000032, 244.9, 245.0, 0.10703830365696364, 0.07954702058881771, 0.05372821101531183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78647a51-8aad-4a00-b6f9-9c1356a05a04", 3, 0, 0.0, 513.6666666666667, 178, 1174, 189.0, 1174.0, 1174.0, 1174.0, 0.10663633455372694, 0.04825016439768244, 0.06838332652045641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 126.00000000000003, 78, 325, 82.5, 246.9, 321.0999999999999, 325.0, 0.10703715794938212, 0.1009849592723614, 0.05699937717753718], "isController": false}, {"data": ["login", 22, 0, 0.0, 2278.590909090909, 1416, 3414, 2229.0, 3379.0, 3413.7, 3414.0, 0.08906594118409121, 29.181628542901443, 0.17466065117324134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 97.70588235294117, 82, 256, 85.0, 136.7999999999999, 256.0, 256.0, 0.09286065439449391, 0.07517722899710494, 0.03300906074179276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db574084-89d7-4095-846e-7da58500e8b5", 3, 0, 0.0, 299.3333333333333, 240, 374, 284.0, 374.0, 374.0, 374.0, 0.01768993089133665, 0.024386997827086823, 0.011344128859353257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8361f717-355f-4b28-86a1-16c294098332", 3, 0, 0.0, 295.3333333333333, 166, 448, 272.0, 448.0, 448.0, 448.0, 0.02251778905335215, 0.02661526434007866, 0.014440118631218662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afb5f741-3ec8-4c8a-a11d-8dcd36be8e8e", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 597.8499999999999, 161, 1258, 529.0, 1121.5, 1251.1999999999998, 1258.0, 0.10699020504672797, 57.690064128925876, 0.22830497758555204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9d4f609-e713-431c-b4be-cc7b0945fda0", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 588.6, 78, 1010, 837.0, 1006.8, 1010.0, 1010.0, 0.04331254331254331, 31.094751602564102, 0.07007834156271657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 237.07142857142858, 159, 479, 175.0, 402.0, 479.0, 479.0, 0.10881139099818907, 0.1686364038223887, 0.24471936862190372], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 867.9583333333331, 86, 1463, 900.5, 1410.5, 1454.25, 1463.0, 0.09946454917693086, 0.03108267161779089, 0.0448756071481856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/06674601-7446-4162-ae10-595c885ca617", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/466abe5b-8bba-45e7-83e1-eae631a9a6f9", 3, 0, 0.0, 288.3333333333333, 210, 394, 261.0, 394.0, 394.0, 394.0, 0.07295365011429406, 0.03300962684207966, 0.046783427970429455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 106.6111111111111, 81, 325, 85.0, 250.30000000000013, 325.0, 325.0, 0.10117020200317, 0.07854522518800795, 0.035962845243314334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 370.5882352941176, 161, 1201, 173.0, 1083.3999999999999, 1201.0, 1201.0, 0.09074797685392778, 19.274551247918136, 0.19999690556071575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 244.9375, 159, 333, 244.5, 329.5, 333.0, 333.0, 0.08918816473054025, 0.1382242357689135, 0.2005862728265959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f826bf4-aa7d-4b3e-afdb-9ff4f3c2325d", 2, 0, 0.0, 383.5, 293, 474, 383.5, 474.0, 474.0, 474.0, 0.01353628740245413, 0.02675531806891324, 0.008413913019201224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e586c643-75cf-4e6d-82cb-ff56e6ad6328", 3, 0, 0.0, 266.6666666666667, 170, 401, 229.0, 401.0, 401.0, 401.0, 0.019212295869356386, 0.026485700848543067, 0.012320385046429714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 98.7, 80, 246, 82.5, 229.80000000000007, 246.0, 246.0, 0.05358109230414771, 0.039819542229937895, 0.026895196722980394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 97.6, 79, 243, 81.0, 227.70000000000005, 243.0, 243.0, 0.05358137939903125, 0.014337205034506409, 0.03055813043851001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 81.19999999999999, 79, 82, 82.0, 82.0, 82.0, 82.0, 0.053581666496991386, 0.01444193354801721, 0.03150015940545783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.5, 83, 92, 87.5, 92.0, 92.0, 92.0, 0.011348612348425097, 0.0033469540324456825, 0.0070153043130401225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 112.2, 78, 243, 81.0, 242.3, 243.0, 243.0, 0.05358224070214168, 0.014442088314249125, 0.0315528233822182], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 923.8103448275863, 621, 1555, 879.0, 1207.2, 1291.2999999999997, 1555.0, 0.25899447627298017, 309.84743467087605, 0.5114129209218417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 867.9583333333331, 86, 1463, 900.5, 1410.5, 1454.25, 1463.0, 0.09743027645840945, 0.030446961393252953, 0.04395780051150895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 126.42857142857143, 79, 243, 81.0, 243.0, 243.0, 243.0, 0.03203895937459951, 0.008635500768935024, 0.018866691897347174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db574084-89d7-4095-846e-7da58500e8b5", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 103.0, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.03206229245391045, 0.008641789762968052, 0.018849121149662203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 150.66666666666666, 79, 854, 82.0, 305.00000000000085, 854.0, 854.0, 0.09370168506863648, 4.707904721328586, 0.05463898172296577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 136.66666666666666, 77, 459, 82.0, 261.9000000000003, 459.0, 459.0, 0.09370022175719149, 1.5544618711674005, 0.05472963256499151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.71428571428571, 78, 241, 82.0, 241.0, 241.0, 241.0, 0.03203837281681374, 0.008572767726373989, 0.018271884497089084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 109.66666666666667, 79, 242, 83.5, 239.3, 242.0, 242.0, 0.09370022175719149, 0.06963463745822532, 0.04703311912421526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.85714285714286, 80, 236, 82.0, 236.0, 236.0, 236.0, 0.03206141134332733, 0.023826888703390725, 0.016093325615693602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 98.27777777777777, 78, 236, 82.0, 232.4, 236.0, 236.0, 0.09370217284927486, 0.032891333460004786, 0.05300232498516382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 85.0, 83, 92, 84.0, 92.0, 92.0, 92.0, 0.03218228043639172, 0.025330974640363015, 0.01143979499887362], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 476.0, 80, 1174, 410.5, 987.5, 1174.0, 1174.0, 0.07944163876751971, 0.015338619985246554, 0.054061985757249055], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bcfe5f7a-b39a-4fa1-9da4-df5eb96640e0", 3, 0, 0.0, 342.6666666666667, 193, 558, 277.0, 558.0, 558.0, 558.0, 0.04242141432995376, 0.027272881934133686, 0.02720383666341436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5baeb908-053d-46e6-aa8e-d0afc940606e", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1250.818181818182, 820, 2016, 1249.0, 1733.6999999999998, 1984.9499999999996, 2016.0, 0.0902297577741139, 0.046700948847930045, 0.04150216397617934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/287d6973-875c-4ec6-8439-40d064fd21fe", 3, 0, 0.0, 405.33333333333337, 195, 755, 266.0, 755.0, 755.0, 755.0, 0.019937131578422706, 0.023565014570720327, 0.012785204820798415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 232.57142857142856, 161, 476, 165.0, 476.0, 476.0, 476.0, 0.03202620658733318, 0.04963436509189234, 0.07202768922912921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fdf608a-3436-42fb-a566-70ba9063bef6", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 886.3559322033897, 407, 2405, 700.0, 1540.0, 1826.0, 2405.0, 0.2747751733645056, 84.63196317838032, 0.9993982743886253], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b41de0ef-9836-4755-b7ba-7f701bc2b255", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78647a51-8aad-4a00-b6f9-9c1356a05a04", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 149.3275862068966, 80, 356, 84.0, 328.3, 332.25, 356.0, 0.2596449131980195, 0.19295876849970006, 0.12551194534474577], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 514.2413793103448, 387, 732, 480.5, 645.4, 722.35, 732.0, 0.2595171191809998, 76.30664981856174, 0.13051886365060048], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 118.86206896551725, 79, 343, 83.0, 241.2, 250.29999999999976, 343.0, 0.25998475951409744, 0.46005115648393025, 0.12643790062306692], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 772.9482758620687, 539, 1182, 771.5, 964.1, 1079.1999999999998, 1182.0, 0.25942657780560896, 233.43249073276826, 0.13021998143758107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 90.5625, 81, 124, 85.5, 113.50000000000001, 124.0, 124.0, 0.09333364444548148, 0.06972679492264974, 0.03317719392397975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 151.0568181818182, 80, 1339, 87.0, 281.90000000000003, 363.50000000000006, 1057.9499999999962, 0.7294943692153376, 1.583403180605812, 0.3496694672929542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 86.19999999999999, 82, 97, 85.0, 96.10000000000001, 97.0, 97.0, 0.05426554300815611, 0.04202399961471465, 0.019289704741180493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 86.21428571428572, 82, 98, 85.0, 96.0, 98.0, 98.0, 0.10864672740536094, 0.08816936569712397, 0.0386205163823744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 213.4, 161, 490, 165.5, 473.1, 490.0, 490.0, 0.05355784783144274, 0.08300420362158167, 0.12045285503497327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 288.0, 162, 941, 167.5, 529.7000000000006, 941.0, 941.0, 0.09365975492364127, 6.362069547246143, 0.20931166584280772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8361f717-355f-4b28-86a1-16c294098332", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcfe5f7a-b39a-4fa1-9da4-df5eb96640e0", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=514a6cab-4eb1-4dad-91ed-cbdc480d3374", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 86.66666666666667, 83, 100, 86.0, 92.2, 100.0, 100.0, 0.0796694249992033, 0.06605404475031602, 0.028319990917685552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 95.95, 81, 275, 84.0, 122.50000000000007, 267.5499999999999, 275.0, 0.10745813162546543, 0.0834269674240674, 0.038198007726239665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 82.3125, 79, 90, 82.0, 87.9, 90.0, 90.0, 0.08922745751936514, 0.06631063981663757, 0.04478800113765008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 148.5625, 78, 247, 80.0, 244.2, 247.0, 247.0, 0.08923044319645755, 0.023876114683427117, 0.050889237135479694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 130.5, 78, 245, 81.0, 244.3, 245.0, 245.0, 0.08923044319645755, 0.0240503928927952, 0.05245774101979243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 120.56249999999999, 78, 244, 82.0, 240.5, 244.0, 244.0, 0.08923044319645755, 0.0240503928927952, 0.052544880124476466], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.5970149253731343], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.14925373134328357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.14925373134328357], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.8955223880597015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 24, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

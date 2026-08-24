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

    var data = {"OkPercent": 99.45862335653518, "KoPercent": 0.5413766434648105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7320478723404256, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ef4438b-83a8-4196-9fa2-b38f8547e1ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c65d3a2-a357-4971-9abb-5121048939e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e45d514-3bca-43bf-9d02-e80a6c7a5ad4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/880a3efb-97d9-4f17-a0c8-b969672fa348"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/94b55b4e-5056-4f64-9c9c-5db3cccc08c8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64aa74e5-433d-4580-a743-5d6cc6d49f23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60dde4b9-af8f-45c0-90a8-f8e878eb2280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47793dcc-f44c-4ce6-a74a-d3904c9e01cf"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/adaf7652-3756-4311-ba0e-7c424d1eddce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39bd2af1-cd7d-4fd3-885a-aca847aea8b7"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ffb136e-3c48-42d6-a477-a60512494acb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad777848-80ad-48e6-bd7b-0452f312fcc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d812c99-9c04-46ca-8c6f-f30681eb2ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d08dc42-03af-4b77-b235-50fa46c5773f"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a26e2795-26ae-491c-84ba-5082f55a4701"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dde0559-1071-430a-9101-4e284cb7d539"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60dde4b9-af8f-45c0-90a8-f8e878eb2280"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e45d514-3bca-43bf-9d02-e80a6c7a5ad4"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=880a3efb-97d9-4f17-a0c8-b969672fa348"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f6dffe2-cad8-483f-ad76-dbc7b57daa90"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39bd2af1-cd7d-4fd3-885a-aca847aea8b7"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/64aa74e5-433d-4580-a743-5d6cc6d49f23"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ef4438b-83a8-4196-9fa2-b38f8547e1ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d812c99-9c04-46ca-8c6f-f30681eb2ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d08dc42-03af-4b77-b235-50fa46c5773f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f6dffe2-cad8-483f-ad76-dbc7b57daa90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad777848-80ad-48e6-bd7b-0452f312fcc5"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a26e2795-26ae-491c-84ba-5082f55a4701"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51888656-8bc8-4a82-899f-97acd5f6e985"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f97519e1-0b92-43c3-845a-40849841bcab"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5dde0559-1071-430a-9101-4e284cb7d539"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1ffb136e-3c48-42d6-a477-a60512494acb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 7, 0.5413766434648105, 502.9628770301628, 140, 2911, 162.0, 1418.0, 1718.6, 2330.8399999999992, 5.137966112470992, 735.4671717046285, 3.742979938388117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2353.2280701754385, 1734, 3092, 2330.0, 2915.8, 2982.4999999999995, 3092.0, 0.258112428339839, 310.5949394185791, 1.2691367936436417], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ef4438b-83a8-4196-9fa2-b38f8547e1ae", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c65d3a2-a357-4971-9abb-5121048939e6", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e45d514-3bca-43bf-9d02-e80a6c7a5ad4", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/880a3efb-97d9-4f17-a0c8-b969672fa348", 3, 0, 0.0, 858.6666666666666, 330, 1677, 569.0, 1677.0, 1677.0, 1677.0, 0.03374046831770025, 0.02812804015678071, 0.021636953966754392], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 782.9230769230769, 484, 2013, 660.0, 1682.1999999999998, 2013.0, 2013.0, 0.09327488107452662, 0.01685141894412835, 0.06339777073034232], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 782.9230769230769, 484, 2013, 660.0, 1682.1999999999998, 2013.0, 2013.0, 0.09139482564679415, 0.01651176049282902, 0.062119920556805396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 193.27777777777777, 140, 437, 146.5, 430.7, 437.0, 437.0, 0.10672295314269452, 0.037461887306490534, 0.06036748640764611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 181.05555555555557, 144, 428, 148.0, 424.4, 428.0, 428.0, 0.10672168762562032, 0.07931172293271196, 0.053569284608953945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94b55b4e-5056-4f64-9c9c-5db3cccc08c8", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.5052783821202531, 0.9441134295886076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 280.2222222222222, 143, 1144, 147.0, 504.10000000000105, 1144.0, 1144.0, 0.10654039656703167, 1.7674769717372005, 0.06222948727434153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 268.77777777777777, 142, 1485, 146.5, 547.2000000000015, 1485.0, 1485.0, 0.10653598252809886, 5.352745308347687, 0.06212287002018265], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 492.8461538461538, 262, 1873, 339.0, 1428.9999999999995, 1873.0, 1873.0, 0.09311053653156089, 0.21928398668877444, 0.06019450701552081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64aa74e5-433d-4580-a743-5d6cc6d49f23", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 167.64285714285714, 142, 449, 146.0, 300.0, 449.0, 449.0, 0.06752422431547318, 0.05018157685944833, 0.033893995408352744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60dde4b9-af8f-45c0-90a8-f8e878eb2280", 3, 0, 0.0, 767.3333333333333, 273, 1747, 282.0, 1747.0, 1747.0, 1747.0, 0.03786205590963589, 0.03077524531457058, 0.02428002934309333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47793dcc-f44c-4ce6-a74a-d3904c9e01cf", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 196.28571428571428, 141, 574, 145.0, 501.5, 574.0, 574.0, 0.06752487568188066, 0.02531240805764695, 0.038105206770815754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 904.0, 712, 1147, 853.0, 1147.0, 1147.0, 1147.0, 0.07200633655761708, 21.172253783332934, 0.04106611381801599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1427.0, 998, 1715, 1568.0, 1715.0, 1715.0, 1715.0, 0.07079144839303413, 63.698269702144984, 0.04030411563783095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 333.3333333333333, 145, 428, 427.0, 428.0, 428.0, 428.0, 0.07275020006305018, 0.12873375245531923, 0.04028258148022407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adaf7652-3756-4311-ba0e-7c424d1eddce", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 146.2, 142, 153, 145.5, 152.8, 153.0, 153.0, 0.07118603045338383, 0.05290289958498544, 0.03573205044242118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 231.5, 143, 444, 145.0, 442.7, 444.0, 444.0, 0.0711875507211299, 0.02974026777197204, 0.0400012858251349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 399.40000000000003, 143, 1565, 284.5, 1451.6000000000004, 1565.0, 1565.0, 0.0711875507211299, 6.422736869901192, 0.04123872567165454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 275.0, 143, 879, 145.5, 834.2000000000002, 879.0, 879.0, 0.0711875507211299, 2.1104188986929966, 0.04130824476415565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 240.0, 143, 430, 147.0, 430.0, 430.0, 430.0, 0.07324755231096026, 0.0544349485435945, 0.04113021736211148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 936.0526315789474, 143, 2056, 1284.0, 1717.0, 2056.0, 2056.0, 0.08757293904001621, 41.483961981245564, 0.047522362787031834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 287.7857142857143, 141, 1284, 147.0, 861.5, 1284.0, 1284.0, 0.06752324728942394, 4.356723695173534, 0.039281799832156496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 710.9999999999999, 142, 1318, 1123.0, 1290.0, 1318.0, 1318.0, 0.08757051731130858, 13.563095998027359, 0.04760656669416689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 260.7142857142857, 142, 1167, 146.5, 805.5, 1167.0, 1167.0, 0.06752422431547318, 1.4350687511153555, 0.03934830984454959], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 531.9230769230769, 258, 1054, 504.0, 937.1999999999999, 1054.0, 1054.0, 0.09123191151908151, 0.016482327764677812, 0.06290012649655424], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 605.6999999999999, 288, 1718, 572.0, 1604.8000000000004, 1718.0, 1718.0, 0.07111313388469716, 8.606793426568577, 0.15811560862175633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39bd2af1-cd7d-4fd3-885a-aca847aea8b7", 3, 0, 0.0, 391.3333333333333, 297, 491, 386.0, 491.0, 491.0, 491.0, 0.1235381321034426, 0.05469136056662823, 0.07922204435018942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 682.7272727272727, 156, 1749, 652.5, 1034.7, 1642.7999999999984, 1749.0, 0.0991938247335293, 0.06093058179432611, 0.04485033286291413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 162.42105263157896, 143, 423, 147.0, 159.0, 423.0, 423.0, 0.08768569753972393, 0.0651648592067675, 0.04401410989786924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 191.99999999999997, 141, 441, 147.0, 433.0, 441.0, 441.0, 0.08768812564323855, 0.09278103178925313, 0.04613361708903114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ffb136e-3c48-42d6-a477-a60512494acb", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["login", 22, 0, 0.0, 3118.818181818182, 1957, 4936, 3154.0, 4401.4, 4869.399999999999, 4936.0, 0.09954931310973954, 16.380435583392913, 0.17270886690256837], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad777848-80ad-48e6-bd7b-0452f312fcc5", 3, 0, 0.0, 371.3333333333333, 252, 509, 353.0, 509.0, 509.0, 509.0, 0.024067002535057603, 0.024137511331547026, 0.01543359212046337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 172.92857142857144, 145, 439, 151.0, 307.0, 439.0, 439.0, 0.06901923664724267, 0.0558759249810197, 0.024534181776949545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d812c99-9c04-46ca-8c6f-f30681eb2ecc", 3, 0, 0.0, 888.0, 262, 1295, 1107.0, 1295.0, 1295.0, 1295.0, 0.019364833462432222, 0.026695986234830882, 0.012418203750322748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d08dc42-03af-4b77-b235-50fa46c5773f", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1100.578947368421, 295, 2206, 1431.0, 1869.0, 2206.0, 2206.0, 0.08751001759411932, 55.16550817844444, 0.18502773405475365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a26e2795-26ae-491c-84ba-5082f55a4701", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 515.1666666666666, 291, 1644, 319.0, 942.9000000000011, 1644.0, 1644.0, 0.10644400158483291, 7.230470990683193, 0.23788201569457668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1667.3333333333333, 1145, 1998, 1859.0, 1998.0, 1998.0, 1998.0, 0.07054673721340388, 84.3984237213404, 0.15907462522045857], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1450.0434782608697, 148, 2865, 1319.0, 2768.4, 2860.0, 2865.0, 0.09736109112151511, 0.03111983245426145, 0.04392658603333982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dde0559-1071-430a-9101-4e284cb7d539", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 519.8571428571429, 292, 1733, 435.0, 1162.0, 1733.0, 1733.0, 0.06747508241599352, 5.863079163634304, 0.1505198894854543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 151.35714285714286, 145, 164, 149.0, 161.0, 164.0, 164.0, 0.10035338728522583, 0.07791107704272904, 0.035672493136545115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60dde4b9-af8f-45c0-90a8-f8e878eb2280", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 649.9411764705883, 294, 1772, 571.0, 1728.0, 1772.0, 1772.0, 0.11340061769983523, 24.085892525398403, 0.24992042153344318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 170.00000000000003, 144, 433, 148.0, 322.9999999999999, 433.0, 433.0, 0.06816704071145416, 0.05065929490372716, 0.03421665910711664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 212.6153846153846, 143, 443, 145.0, 441.4, 443.0, 443.0, 0.06816882796809698, 0.026116362878402542, 0.03843714113044892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e45d514-3bca-43bf-9d02-e80a6c7a5ad4", 3, 0, 0.0, 713.6666666666666, 373, 1221, 547.0, 1221.0, 1221.0, 1221.0, 0.019256815307884385, 0.026547074488571083, 0.012348934295746171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 289.6153846153846, 143, 1720, 145.0, 1209.9999999999995, 1720.0, 1720.0, 0.06816990036706869, 4.735375630899319, 0.03962580296276875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 216.53846153846152, 143, 776, 146.0, 638.3999999999999, 776.0, 776.0, 0.06816918543067194, 1.5588068196715295, 0.039691958854652806], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1632.8771929824559, 1142, 2441, 1470.0, 2320.4, 2356.5999999999995, 2441.0, 0.2630328144972612, 314.6786911406395, 0.5193870614389279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1450.0434782608697, 148, 2865, 1319.0, 2768.4, 2860.0, 2865.0, 0.09678260942746775, 0.030934930526918192, 0.0436655913627833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 256.5555555555556, 143, 575, 146.0, 575.0, 575.0, 575.0, 0.05124613518730463, 0.0138124348747032, 0.03017716749799286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 211.55555555555554, 143, 446, 146.0, 446.0, 446.0, 446.0, 0.05124496802883383, 0.01381212028902162, 0.03012643628257614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 165.7857142857143, 142, 433, 145.0, 292.0, 433.0, 433.0, 0.1027900146842878, 0.02770512114537445, 0.06042928597650515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 166.5, 142, 441, 145.0, 296.0, 441.0, 441.0, 0.1027915241046124, 0.02770552798132131, 0.06053055569832156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=880a3efb-97d9-4f17-a0c8-b969672fa348", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 175.77777777777777, 142, 429, 144.0, 429.0, 429.0, 429.0, 0.05124467624752317, 0.013711954386544288, 0.029225479422415563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 147.14285714285714, 144, 151, 147.0, 150.5, 151.0, 151.0, 0.10278850530829209, 0.07638872318321317, 0.051595011453576305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 210.8888888888889, 145, 447, 147.0, 447.0, 447.0, 447.0, 0.05124525981346726, 0.03808363546684432, 0.025722718304806803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.57142857142856, 142, 152, 145.0, 151.0, 152.0, 152.0, 0.1027900146842878, 0.0275043593979442, 0.0586224302496329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 150.0, 146, 160, 150.0, 160.0, 160.0, 160.0, 0.049441041557942156, 0.03891550732002087, 0.01757474524129975], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 834.9230769230769, 479, 1747, 603.0, 1619.3999999999999, 1747.0, 1747.0, 0.08911800595034071, 0.016100420996887726, 0.06065942397205808], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1729.6818181818178, 810, 2911, 1636.5, 2512.9, 2854.2999999999993, 2911.0, 0.09833544903541865, 0.05089627733278504, 0.045230465327814634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 469.8888888888889, 290, 1003, 294.0, 1003.0, 1003.0, 1003.0, 0.051201529219006, 0.07935236999078372, 0.11515343924938558], "isController": false}, {"data": ["addBook", 57, 4, 7.017543859649122, 1540.280701754386, 733, 3790, 1238.0, 2469.4, 2607.499999999994, 3790.0, 0.2537347981695483, 91.52560812190622, 0.9202190118031196], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 283.9824561403509, 144, 599, 150.0, 577.2, 584.1999999999999, 599.0, 0.2647776100336779, 0.19677320433166878, 0.12799308297526418], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 936.6666666666669, 711, 1324, 860.0, 1176.8, 1284.8, 1324.0, 0.2646571297237815, 77.81798358255213, 0.13310392754662842], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 189.82456140350877, 142, 599, 147.0, 432.2, 436.0, 599.0, 0.2653532456891736, 0.4695508605359205, 0.12904874643868014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f6dffe2-cad8-483f-ad76-dbc7b57daa90", 3, 0, 0.0, 739.3333333333334, 386, 1069, 763.0, 1069.0, 1069.0, 1069.0, 0.018753047370197656, 0.025852589717704128, 0.012025879986747848], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1345.1578947368423, 994, 1874, 1294.0, 1719.4, 1776.5999999999995, 1874.0, 0.2637814223834734, 237.3509875389309, 0.13240590928232943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 169.52941176470588, 148, 426, 152.0, 217.99999999999983, 426.0, 426.0, 0.1117538785169603, 0.08348800494675256, 0.03972501150407573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39bd2af1-cd7d-4fd3-885a-aca847aea8b7", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, 2.3391812865497075, 234.25146198830407, 143, 1755, 155.0, 387.8000000000001, 473.8000000000005, 1659.2400000000002, 0.7157896499328162, 1.5941591721536896, 0.34272092156870954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 174.0, 149, 438, 151.0, 328.39999999999986, 438.0, 438.0, 0.06824756014972465, 0.05285187031126137, 0.02425987489697243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64aa74e5-433d-4580-a743-5d6cc6d49f23", 3, 0, 0.0, 1290.0, 819, 1873, 1178.0, 1873.0, 1873.0, 1873.0, 0.02048354829679296, 0.024210860633351313, 0.013135608771055381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ef4438b-83a8-4196-9fa2-b38f8547e1ae", 3, 0, 0.0, 420.66666666666663, 249, 722, 291.0, 722.0, 722.0, 722.0, 0.04033667679565439, 0.026405292003926106, 0.025866944429504938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 167.22222222222217, 146, 428, 150.0, 193.10000000000036, 428.0, 428.0, 0.1068731297202299, 0.08673004960694437, 0.03799005783023797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d812c99-9c04-46ca-8c6f-f30681eb2ecc", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d08dc42-03af-4b77-b235-50fa46c5773f", 3, 0, 0.0, 333.3333333333333, 253, 479, 268.0, 479.0, 479.0, 479.0, 0.10645092612305727, 0.048166271911148965, 0.06826442853594493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f6dffe2-cad8-483f-ad76-dbc7b57daa90", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad777848-80ad-48e6-bd7b-0452f312fcc5", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 484.0769230769231, 290, 1869, 297.0, 1470.5999999999997, 1869.0, 1869.0, 0.06811453721411542, 6.365802900107412, 0.15185059501977943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a26e2795-26ae-491c-84ba-5082f55a4701", 3, 0, 0.0, 499.6666666666667, 276, 620, 603.0, 620.0, 620.0, 620.0, 0.033185840707964605, 0.02766566993915929, 0.02128128456858407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51888656-8bc8-4a82-899f-97acd5f6e985", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.7639615729665072, 1.4274633672248804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97519e1-0b92-43c3-845a-40849841bcab", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 335.6428571428571, 290, 587, 293.0, 585.0, 587.0, 587.0, 0.10267994660642776, 0.15913386256289147, 0.23092960647910463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dde0559-1071-430a-9101-4e284cb7d539", 3, 0, 0.0, 761.0, 339, 1428, 516.0, 1428.0, 1428.0, 1428.0, 0.015606386133205708, 0.02151466317517128, 0.010008001524223712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 151.0, 145, 161, 150.0, 160.5, 161.0, 161.0, 0.07735687045044906, 0.0641367021605774, 0.027497950042933067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 181.8947368421053, 146, 439, 151.0, 432.0, 439.0, 439.0, 0.08933147147740149, 0.06935402326614666, 0.03175454650173256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ffb136e-3c48-42d6-a477-a60512494acb", 3, 0, 0.0, 469.3333333333333, 267, 576, 565.0, 576.0, 576.0, 576.0, 0.04098192697020614, 0.026347430262420937, 0.0262807279073262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 145.88235294117644, 142, 151, 146.0, 150.2, 151.0, 151.0, 0.11351495726495726, 0.08436023679553953, 0.05697918753338676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.52941176470588, 141, 434, 146.0, 433.2, 434.0, 434.0, 0.1135164732434995, 0.060462128901294085, 0.06305746187181986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 451.11764705882354, 144, 1626, 147.0, 1585.2, 1626.0, 1626.0, 0.11351723124795501, 18.05043310788477, 0.06501417713362313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 405.0, 143, 1133, 424.0, 1121.8, 1133.0, 1133.0, 0.11351268337306278, 5.9151662752148395, 0.06512242468099597], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.23201856148491878], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.30935808197989173], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

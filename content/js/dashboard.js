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

    var data = {"OkPercent": 99.46401225114855, "KoPercent": 0.5359877488514548};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7495042961004627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a880c67a-225d-431e-8796-9b1397126cbe"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ca47b939-c5cc-4079-8f6e-69a65c0a0a49"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0b236a1-1c35-436e-b8ce-c50f821193d1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a77fc8a-e67a-45de-ac94-2e2dd2e07497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86871a4a-d33d-4755-9ab4-1218c2d957a8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28cdbb35-9102-4224-87b2-9e07a2404d38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc4f85dd-870b-431f-a587-87b3899b54cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff4e08e4-18b4-410f-b66f-5df998264d56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16dcbc4e-8bb5-46ec-92d2-490e506e5d10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=456aecea-66f8-495e-9930-fa0f883ecd22"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e00f0d6e-1fc5-4c04-86f6-a35d16ea1e81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d7dc1cd-0945-4a25-9a93-8a751cd6a689"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28cdbb35-9102-4224-87b2-9e07a2404d38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/86871a4a-d33d-4755-9ab4-1218c2d957a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a880c67a-225d-431e-8796-9b1397126cbe"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b333b55-9358-48e8-a85f-f6a207403511"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e68d7a0b-f263-40f3-b8ce-f35f15c80542"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a77fc8a-e67a-45de-ac94-2e2dd2e07497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9803370786516854, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cc4f85dd-870b-431f-a587-87b3899b54cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6ac8a7d-16a3-4e87-8a3c-a3c1177bfa7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16dcbc4e-8bb5-46ec-92d2-490e506e5d10"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/696a3088-f0de-4f34-adfe-b448244351bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca47b939-c5cc-4079-8f6e-69a65c0a0a49"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e00f0d6e-1fc5-4c04-86f6-a35d16ea1e81"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0b236a1-1c35-436e-b8ce-c50f821193d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/456aecea-66f8-495e-9930-fa0f883ecd22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff4e08e4-18b4-410f-b66f-5df998264d56"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d7dc1cd-0945-4a25-9a93-8a751cd6a689"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 7, 0.5359877488514548, 478.47473200612575, 139, 3100, 169.0, 1287.7999999999997, 1612.099999999998, 1992.7200000000003, 5.075116385708845, 709.9369611817715, 3.7116236219271452], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2357.696428571428, 1728, 3691, 2288.0, 2948.2000000000003, 3068.65, 3691.0, 0.24440807419530824, 294.106088891162, 1.201752591380251], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a880c67a-225d-431e-8796-9b1397126cbe", 3, 0, 0.0, 440.0, 252, 750, 318.0, 750.0, 750.0, 750.0, 0.04518888955835392, 0.02905210184822558, 0.028978552223293364], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 600.5833333333333, 460, 1650, 498.5, 1346.100000000001, 1650.0, 1650.0, 0.08245382585751979, 0.014896443148087071, 0.05604283476253298], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 600.5833333333333, 460, 1650, 498.5, 1346.100000000001, 1650.0, 1650.0, 0.08185203879786639, 0.014787721853130159, 0.055633807620424816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 157.49999999999997, 140, 424, 143.0, 148.9, 410.24999999999983, 424.0, 0.12423131871544817, 0.04257106419653394, 0.07032899947201689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 172.64999999999998, 141, 435, 143.0, 395.8000000000006, 434.4, 435.0, 0.12422900374550445, 0.09232253110383681, 0.06235713664569267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 264.1, 141, 841, 143.5, 570.9, 827.4999999999998, 841.0, 0.12422977539256608, 1.8581935554251143, 0.07262103862303718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 284.4, 141, 1539, 146.0, 431.6, 1483.6499999999992, 1539.0, 0.12422977539256608, 5.62091812986049, 0.07249972048300538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca47b939-c5cc-4079-8f6e-69a65c0a0a49", 3, 0, 0.0, 789.6666666666666, 252, 1534, 583.0, 1534.0, 1534.0, 1534.0, 0.03861202635914333, 0.03218925765161656, 0.024760967424320428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0b236a1-1c35-436e-b8ce-c50f821193d1", 3, 0, 0.0, 545.6666666666666, 239, 817, 581.0, 817.0, 817.0, 817.0, 0.020485646390429105, 0.02421334050900003, 0.013136954228237416], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 376.4166666666667, 237, 1628, 252.5, 1240.4000000000015, 1628.0, 1628.0, 0.08287235585389603, 0.20867809528249115, 0.05357568317898358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a77fc8a-e67a-45de-ac94-2e2dd2e07497", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86871a4a-d33d-4755-9ab4-1218c2d957a8", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28cdbb35-9102-4224-87b2-9e07a2404d38", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 160.3809523809524, 141, 427, 145.0, 161.60000000000002, 400.6999999999996, 427.0, 0.10630650697066953, 0.07900317559050733, 0.053360883381761856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 172.14285714285714, 141, 446, 144.0, 370.4000000000002, 443.9, 446.0, 0.10630812143424842, 0.028445727805648507, 0.06062885050546981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1098.5, 1026, 1128, 1120.0, 1128.0, 1128.0, 1128.0, 0.13345789403443215, 39.24105206526091, 0.07611270519151207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1602.5, 1253, 1808, 1674.5, 1808.0, 1808.0, 1808.0, 0.1304971943103223, 117.4216048300274, 0.07429674246378702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 213.75, 141, 423, 145.5, 423.0, 423.0, 423.0, 0.13800241504226324, 0.24419958599275488, 0.07641344661031568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 188.23076923076923, 141, 436, 144.0, 430.8, 436.0, 436.0, 0.08916140271462179, 0.06626155025959686, 0.04475484472198789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 208.15384615384613, 140, 436, 143.0, 431.2, 436.0, 436.0, 0.08933234380583271, 0.0342243805145543, 0.05037023532200874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 341.99999999999994, 142, 1552, 146.0, 1109.1999999999996, 1552.0, 1552.0, 0.08914672865793029, 6.192516700010972, 0.05181921472018213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 285.2307692307692, 141, 861, 145.0, 687.3999999999999, 861.0, 861.0, 0.08933295767679335, 2.0427532288710375, 0.052014705149701426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc4f85dd-870b-431f-a587-87b3899b54cb", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 147.0, 143, 156, 144.5, 156.0, 156.0, 156.0, 0.13799289336599166, 0.10255135922999967, 0.07748624383344259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1106.7333333333333, 140, 1830, 1321.0, 1830.0, 1830.0, 1830.0, 0.06898486472068029, 41.387999551023505, 0.03660329736155887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 198.61904761904762, 142, 444, 144.0, 426.6, 442.29999999999995, 444.0, 0.10630650697066953, 0.02865292570693827, 0.062496598824553766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 790.6666666666666, 141, 1275, 1119.0, 1272.0, 1275.0, 1275.0, 0.06898359570094231, 13.528509482944955, 0.0366699908136845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 197.0, 141, 425, 143.0, 423.0, 424.8, 425.0, 0.10630919777054425, 0.028653650961592003, 0.06260199829652166], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 706.1666666666667, 269, 1617, 571.5, 1498.5000000000005, 1617.0, 1617.0, 0.08195881569511321, 0.014807012601167914, 0.05650676160229485], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 595.7692307692307, 287, 1988, 567.0, 1532.7999999999997, 1988.0, 1988.0, 0.08888888888888889, 8.307318376068377, 0.19816372863247864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 684.5999999999999, 197, 1245, 662.0, 1082.0, 1237.0, 1245.0, 0.08642220705032366, 0.053085515854153886, 0.03907566588310532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.73333333333332, 141, 152, 144.0, 152.0, 152.0, 152.0, 0.06898074057723085, 0.05126400740163346, 0.03462509829755532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff4e08e4-18b4-410f-b66f-5df998264d56", 3, 0, 0.0, 382.6666666666667, 273, 458, 417.0, 458.0, 458.0, 458.0, 0.023258698753333744, 0.023326839472337654, 0.014915246270855298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 241.0, 142, 443, 146.0, 442.4, 443.0, 443.0, 0.06898327845330292, 0.08753151673534336, 0.03547968097533158], "isController": false}, {"data": ["login", 20, 0, 0.0, 3009.7, 1907, 5105, 2832.5, 4442.300000000001, 5074.599999999999, 5105.0, 0.08610186711898848, 20.721002909166838, 0.1584644323949665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 165.95238095238096, 143, 430, 151.0, 178.20000000000002, 404.99999999999966, 430.0, 0.10739051281526786, 0.08694017101939165, 0.03817397135230225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16dcbc4e-8bb5-46ec-92d2-490e506e5d10", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=456aecea-66f8-495e-9930-fa0f883ecd22", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1255.2, 287, 1984, 1472.0, 1978.6, 1984.0, 1984.0, 0.06893445711817203, 55.015329120384834, 0.14327685830062775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 488.15000000000003, 285, 1682, 294.5, 866.4, 1641.2499999999995, 1682.0, 0.12411875682653162, 7.60720103088385, 0.27755814575886206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1750.25, 1397, 1962, 1821.0, 1962.0, 1962.0, 1962.0, 0.12988699831146902, 155.39000600727368, 0.29287996005974803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e00f0d6e-1fc5-4c04-86f6-a35d16ea1e81", 3, 0, 0.0, 407.3333333333333, 242, 589, 391.0, 589.0, 589.0, 589.0, 0.017832623000517148, 0.0245837104190072, 0.011435633890305592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d7dc1cd-0945-4a25-9a93-8a751cd6a689", 3, 0, 0.0, 326.6666666666667, 253, 472, 255.0, 472.0, 472.0, 472.0, 0.024987506246876564, 0.029477448775612192, 0.016023889097118108], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1121.9545454545453, 239, 1921, 1116.5, 1733.3999999999999, 1896.5499999999997, 1921.0, 0.08982451556005586, 0.028405089171246355, 0.040526295106197076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 163.94444444444443, 143, 441, 147.5, 182.70000000000041, 441.0, 441.0, 0.08774794889169465, 0.06812462828993872, 0.031191653707594583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 429.0476190476191, 286, 852, 301.0, 593.4, 826.1999999999996, 852.0, 0.10622692093682028, 0.16463098000657594, 0.23890683488036826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 637.3125, 288, 1682, 575.5, 1581.9, 1682.0, 1682.0, 0.13726011649952388, 20.712487909313957, 0.30431130808891027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28cdbb35-9102-4224-87b2-9e07a2404d38", 3, 0, 0.0, 411.66666666666663, 229, 768, 238.0, 768.0, 768.0, 768.0, 0.027219525472939255, 0.027299270176473257, 0.017455229551331487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86871a4a-d33d-4755-9ab4-1218c2d957a8", 3, 0, 0.0, 804.3333333333334, 261, 1628, 524.0, 1628.0, 1628.0, 1628.0, 0.0639467962655071, 0.03005832480709383, 0.04100754838640917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 188.85714285714286, 145, 437, 146.0, 437.0, 437.0, 437.0, 0.03589577916916655, 0.02667645307396069, 0.018017998528273054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 184.28571428571428, 141, 422, 144.0, 422.0, 422.0, 422.0, 0.03589761998779481, 0.009605417848296658, 0.02047286139928923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 223.42857142857142, 140, 431, 143.0, 431.0, 431.0, 431.0, 0.03589817227020041, 0.009675679244702456, 0.021104198932285788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 186.57142857142858, 141, 444, 143.0, 444.0, 444.0, 444.0, 0.03589651547396221, 0.009675232686341377, 0.021138280108202356], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1587.357142857143, 1127, 3100, 1439.0, 2315.4, 2419.95, 3100.0, 0.2516514627241271, 301.06263762189366, 0.49691333752752437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a880c67a-225d-431e-8796-9b1397126cbe", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1121.9545454545453, 239, 1921, 1116.5, 1733.3999999999999, 1896.5499999999997, 1921.0, 0.0880387370442995, 0.027840374764896557, 0.039720602064908565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 225.28571428571428, 142, 430, 148.0, 430.0, 430.0, 430.0, 0.04439230110663665, 0.01196511240764816, 0.02614116949931826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 223.85714285714286, 142, 424, 144.0, 424.0, 424.0, 424.0, 0.04439201958322235, 0.0119650365282904, 0.026097652137792828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 341.83333333333337, 140, 1545, 143.0, 1324.5000000000005, 1545.0, 1545.0, 0.09342883836810963, 9.36320988074847, 0.05403382253711201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 381.44444444444446, 142, 1128, 286.5, 1116.3, 1128.0, 1128.0, 0.09342447409806455, 3.0745937657329407, 0.05412253333437138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 176.05555555555554, 142, 424, 145.5, 422.2, 424.0, 424.0, 0.09342204967976997, 0.06942790996709468, 0.046893489780665785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 224.00000000000003, 142, 425, 143.0, 425.0, 425.0, 425.0, 0.0443908935252711, 0.011878032056566682, 0.025316681463631176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 221.83333333333334, 141, 432, 144.5, 427.5, 432.0, 432.0, 0.09328696625603125, 0.04052962379439552, 0.05233220654770851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 186.57142857142856, 143, 433, 144.0, 433.0, 433.0, 433.0, 0.04439230110663665, 0.03299076283413134, 0.022282854266417223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 151.57142857142858, 145, 162, 152.0, 162.0, 162.0, 162.0, 0.046160136106458464, 0.03633307588066946, 0.016408485881592657], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 572.5833333333334, 441, 817, 532.0, 802.3000000000001, 817.0, 817.0, 0.0818732601932209, 0.01479155579662682, 0.05572818589323726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1469.15, 897, 2210, 1364.0, 1990.3, 2199.1499999999996, 2210.0, 0.08936310912129254, 0.046252390463168994, 0.04110353944934452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 453.4285714285714, 288, 857, 299.0, 857.0, 857.0, 857.0, 0.04435039345134762, 0.06873444766336784, 0.09974507433442731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b333b55-9358-48e8-a85f-f6a207403511", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e68d7a0b-f263-40f3-b8ce-f35f15c80542", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.605950545540797, 1.1322195208728651], "isController": false}, {"data": ["addBook", 61, 2, 3.278688524590164, 1416.1475409836062, 804, 2532, 1155.0, 2443.6000000000004, 2503.6, 2532.0, 0.29521652438198115, 93.73412001277659, 1.0746166949179201], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 244.03571428571416, 142, 589, 150.0, 574.3, 586.3, 589.0, 0.25309361752130954, 0.1880900809899576, 0.12234505925102367], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 892.8928571428572, 699, 1332, 843.5, 1172.7, 1267.3, 1332.0, 0.2529975694162081, 74.38968571828721, 0.1272399885247531], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 214.08928571428575, 139, 583, 146.0, 428.0, 431.25, 583.0, 0.2533008263939461, 0.4482237279549125, 0.12318731596111833], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1340.0357142857147, 979, 2527, 1284.0, 1739.1000000000001, 1839.3, 2527.0, 0.2523613814983056, 227.07521467616627, 0.12667358407239165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a77fc8a-e67a-45de-ac94-2e2dd2e07497", 3, 0, 0.0, 337.6666666666667, 236, 441, 336.0, 441.0, 441.0, 441.0, 0.02070164785116895, 0.024468646923045075, 0.013275470789974882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 152.4375, 143, 178, 150.0, 171.70000000000002, 178.0, 178.0, 0.13672642750935723, 0.10214425492642408, 0.04860197227871682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, 1.1235955056179776, 210.96067415730343, 142, 1085, 153.0, 353.5, 422.2499999999999, 664.7200000000042, 0.7571503921868885, 1.5699222937190547, 0.36661179453150256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 201.14285714285714, 144, 428, 150.0, 428.0, 428.0, 428.0, 0.035657888034231575, 0.02761396993275941, 0.012675264887168254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc4f85dd-870b-431f-a587-87b3899b54cb", 3, 0, 0.0, 764.6666666666666, 248, 1571, 475.0, 1571.0, 1571.0, 1571.0, 0.021199765389263023, 0.025057404989718115, 0.013594901633088595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6ac8a7d-16a3-4e87-8a3c-a3c1177bfa7c", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 162.3, 142, 448, 146.0, 157.60000000000002, 433.4999999999998, 448.0, 0.12268583837367654, 0.09956243328957538, 0.04361098160939283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16dcbc4e-8bb5-46ec-92d2-490e506e5d10", 3, 0, 0.0, 927.0, 237, 2090, 454.0, 2090.0, 2090.0, 2090.0, 0.034904826173965654, 0.029098717393074885, 0.02238362876390376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 417.7142857142857, 289, 859, 301.0, 859.0, 859.0, 859.0, 0.035868189527513465, 0.05558868826187878, 0.08066839890806983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 640.7222222222222, 286, 1689, 575.0, 1470.3000000000004, 1689.0, 1689.0, 0.09321305397035824, 12.518990541464273, 0.20698840597909957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/696a3088-f0de-4f34-adfe-b448244351bc", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca47b939-c5cc-4079-8f6e-69a65c0a0a49", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e00f0d6e-1fc5-4c04-86f6-a35d16ea1e81", 1, 0, 0.0, 1222.0, 1222, 1222, 1222.0, 1222.0, 1222.0, 1222.0, 0.8183306055646482, 0.14784293166939444, 0.5642005932896891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0b236a1-1c35-436e-b8ce-c50f821193d1", 1, 0, 0.0, 1617.0, 1617, 1617, 1617.0, 1617.0, 1617.0, 1617.0, 0.6184291898577613, 0.11172792980828695, 0.42637793753865183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 149.69230769230768, 142, 169, 147.0, 163.0, 169.0, 169.0, 0.08661700624975015, 0.07181429522074011, 0.03078963894034087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 150.86666666666665, 143, 171, 151.0, 164.4, 171.0, 171.0, 0.06738362847362604, 0.052314438121613974, 0.02395277418398426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/456aecea-66f8-495e-9930-fa0f883ecd22", 3, 0, 0.0, 601.6666666666666, 253, 1012, 540.0, 1012.0, 1012.0, 1012.0, 0.019870049873825183, 0.023485726266881266, 0.012742186930805864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 162.06250000000003, 141, 426, 144.0, 233.5000000000002, 426.0, 426.0, 0.13777425688010195, 0.10238887645093514, 0.06915621878551992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 270.125, 140, 446, 149.0, 444.6, 446.0, 446.0, 0.13778018893108407, 0.06273438778234175, 0.07713134111791402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff4e08e4-18b4-410f-b66f-5df998264d56", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 453.18750000000006, 141, 1540, 422.5, 1439.9, 1540.0, 1540.0, 0.13743225019541147, 15.490134538657115, 0.0793188084623908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d7dc1cd-0945-4a25-9a93-8a751cd6a689", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 330.31249999999994, 141, 1298, 148.0, 981.6000000000004, 1298.0, 1298.0, 0.13777900248002206, 5.096443956237945, 0.07965348580876275], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.38284839203675347], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15313935681470137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

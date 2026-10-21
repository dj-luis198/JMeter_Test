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

    var data = {"OkPercent": 98.54517611026034, "KoPercent": 1.454823889739663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8252139565503621, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37272727272727274, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/775d128c-8464-4fd6-a233-fef5bf3839cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/294be0f5-c46b-4395-8d7a-05f4c0ce4aae"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1f79d74-ab22-4086-8624-7c8dfd19592d"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91181be3-9d0f-4a53-97e9-d5fda394e980"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93d777ca-c908-4002-894d-4e8b0c3e833c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e45ae90-15f0-430c-802c-dbed63ecc8d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07caf301-89fa-41b8-94d0-9e54859f08ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9d23049-d937-498f-80d2-bace46e83a61"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1f79d74-ab22-4086-8624-7c8dfd19592d"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26fd3fbc-297b-4899-ac2b-a11f0d7325b8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92ff0548-49e7-4ef7-9786-902fb368f29c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2529794-c0b7-4866-baf1-a497c0b4d1b8"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa2e42fe-47f1-45fb-aa80-e5260ea1b7a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=775d128c-8464-4fd6-a233-fef5bf3839cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b83c4e15-c1dd-4327-8cfa-ac38c57d5aa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b4b1572-c29e-4a0a-8ad4-678c35500bb6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93d777ca-c908-4002-894d-4e8b0c3e833c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87d84620-4525-4ec0-bcb3-8beaea8c97e8"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e45ae90-15f0-430c-802c-dbed63ecc8d9"], "isController": false}, {"data": [0.9257142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b4b1572-c29e-4a0a-8ad4-678c35500bb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92ff0548-49e7-4ef7-9786-902fb368f29c"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa2e42fe-47f1-45fb-aa80-e5260ea1b7a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e9d23049-d937-498f-80d2-bace46e83a61"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b83c4e15-c1dd-4327-8cfa-ac38c57d5aa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07caf301-89fa-41b8-94d0-9e54859f08ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97182119-33c9-45ce-872d-eb45adf12fac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2529794-c0b7-4866-baf1-a497c0b4d1b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26fd3fbc-297b-4899-ac2b-a11f0d7325b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 19, 1.454823889739663, 289.7588055130172, 78, 1934, 87.0, 827.8999999999999, 1015.9499999999996, 1271.8600000000001, 5.108666739684875, 723.9842189908134, 3.733352551546291], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1366.1454545454544, 973, 1928, 1369.0, 1622.6, 1823.3999999999999, 1928.0, 0.2466500439485533, 296.80499465638286, 1.2127763391415682], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/775d128c-8464-4fd6-a233-fef5bf3839cc", 3, 0, 0.0, 713.6666666666666, 385, 899, 857.0, 899.0, 899.0, 899.0, 0.02339236005520597, 0.023460892360055205, 0.01500096006144393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/294be0f5-c46b-4395-8d7a-05f4c0ce4aae", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 476.92857142857144, 81, 683, 474.0, 672.0, 683.0, 683.0, 0.07532956685499058, 0.014224130683346785, 0.05094309086629002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 476.92857142857144, 81, 683, 474.0, 672.0, 683.0, 683.0, 0.07449067004357704, 0.014065725712050994, 0.05037577051286826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 125.0, 79, 242, 81.0, 241.1, 242.0, 242.0, 0.19055079766681135, 0.06688713438065698, 0.10778443014725343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 90.6111111111111, 80, 243, 82.0, 99.00000000000023, 243.0, 243.0, 0.19022256039566293, 0.14136657076279247, 0.09548280863610424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1f79d74-ab22-4086-8624-7c8dfd19592d", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.22359413675742573, 0.8532835705445544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 142.16666666666666, 79, 627, 81.0, 353.40000000000043, 627.0, 627.0, 0.19055079766681135, 3.161187283645449, 0.11129936456602056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91181be3-9d0f-4a53-97e9-d5fda394e980", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 137.16666666666669, 79, 784, 81.0, 294.4000000000008, 784.0, 784.0, 0.19054878048780488, 9.573846005488864, 0.11111210355267616], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 277.28571428571433, 80, 899, 259.5, 611.0, 899.0, 899.0, 0.07545339405535045, 0.15728053672963432, 0.04877417708642109], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 90.83333333333334, 80, 245, 82.0, 101.00000000000023, 245.0, 245.0, 0.10850498218709875, 0.08063700336365445, 0.05446441488688356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 80.33333333333334, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.10850563626499488, 0.029033734703719335, 0.061882120682379894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 577.8333333333334, 471, 706, 590.0, 706.0, 706.0, 706.0, 0.04057069443505308, 11.92913123774427, 0.02313797416999121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 883.3333333333334, 771, 947, 889.0, 947.0, 947.0, 947.0, 0.04050742298526205, 36.44865040659326, 0.023062331641023216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 160.5, 80, 241, 160.0, 241.0, 241.0, 241.0, 0.04072379762987498, 0.07206203252473971, 0.022549212164198352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 81.76190476190477, 80, 84, 81.0, 83.8, 84.0, 84.0, 0.1094747817020722, 0.08135772351101264, 0.05495120878404797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 88.8095238095238, 79, 241, 81.0, 86.8, 225.5999999999998, 241.0, 0.10938582463889655, 0.029269253858454743, 0.0623841031143707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 111.61904761904762, 79, 247, 81.0, 240.8, 246.39999999999998, 247.0, 0.10938582463889655, 0.02948289804720259, 0.0643069008131013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 81.04761904761907, 78, 87, 81.0, 84.4, 86.8, 87.0, 0.10947763528307788, 0.029507643884892087, 0.06446778718329685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93d777ca-c908-4002-894d-4e8b0c3e833c", 3, 0, 0.0, 281.0, 179, 402, 262.0, 402.0, 402.0, 402.0, 0.03830732691472789, 0.03113717295119647, 0.024565570970707665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 106.66666666666667, 80, 235, 81.5, 235.0, 235.0, 235.0, 0.0407232448281479, 0.03026405206466851, 0.022867056422055707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 115.77777777777779, 79, 242, 81.0, 240.2, 242.0, 242.0, 0.10840304251205984, 0.02921800755207863, 0.06372913241431644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 774.3076923076924, 81, 1038, 950.0, 1034.4, 1038.0, 1038.0, 0.07097929588538482, 49.1331034980508, 0.03703592166615707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 107.1111111111111, 79, 241, 81.0, 239.2, 241.0, 241.0, 0.10850629035077673, 0.029245836071107787, 0.06389579402492028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 505.07692307692315, 80, 873, 549.0, 778.5999999999999, 873.0, 873.0, 0.0709812336538409, 16.058906916302206, 0.037106250375381525], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 558.7692307692307, 80, 1105, 443.0, 1090.6, 1105.0, 1105.0, 0.07256650999743226, 0.013747952089357285, 0.04963326874448774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e45ae90-15f0-430c-802c-dbed63ecc8d9", 3, 0, 0.0, 355.3333333333333, 302, 423, 341.0, 423.0, 423.0, 423.0, 0.045551169146674765, 0.029285012716368054, 0.02921087344366839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 194.9523809523809, 161, 330, 164.0, 324.4, 329.5, 330.0, 0.10933741526350317, 0.16945163869451127, 0.24590240952328887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07caf301-89fa-41b8-94d0-9e54859f08ca", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9d23049-d937-498f-80d2-bace46e83a61", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 364.22727272727275, 92, 895, 335.0, 612.0999999999999, 855.8499999999995, 895.0, 0.09368638907105686, 0.0575475964118113, 0.04236015443349544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 105.92307692307692, 79, 241, 82.0, 240.2, 241.0, 241.0, 0.07103980414872456, 0.052794229450370496, 0.03565865169184026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 161.0769230769231, 79, 324, 83.0, 292.0, 324.0, 324.0, 0.07104174522244264, 0.10108719486204239, 0.035926459498008094], "isController": false}, {"data": ["login", 22, 0, 0.0, 1857.3636363636363, 1081, 2533, 1777.0, 2362.5, 2508.9999999999995, 2533.0, 0.09521748539277212, 31.1971248782731, 0.1867239910192599], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 83.00000000000001, 81, 88, 82.0, 87.1, 88.0, 88.0, 0.10438837113545552, 0.0845097262414967, 0.03710680380205645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1f79d74-ab22-4086-8624-7c8dfd19592d", 3, 0, 0.0, 347.3333333333333, 281, 438, 323.0, 438.0, 438.0, 438.0, 0.017500466679111443, 0.024125806115246406, 0.011222629999299981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 881.3846153846152, 162, 1121, 1034.0, 1117.4, 1121.0, 1121.0, 0.07094559564284895, 65.3142943181446, 0.14559515680340976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26fd3fbc-297b-4899-ac2b-a11f0d7325b8", 3, 0, 0.0, 263.6666666666667, 173, 430, 188.0, 430.0, 430.0, 430.0, 0.025887733528929542, 0.021581538270699398, 0.016601183285153386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92ff0548-49e7-4ef7-9786-902fb368f29c", 3, 0, 0.0, 353.33333333333337, 175, 618, 267.0, 618.0, 618.0, 618.0, 0.07514841812579845, 0.03326883094110869, 0.048190880113223616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 278.05555555555554, 162, 865, 165.0, 523.9000000000005, 865.0, 865.0, 0.19005786206022723, 12.910148413412806, 0.4247430259323394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 763.0, 80, 1029, 970.5, 1029.0, 1029.0, 1029.0, 0.05273392439273591, 47.319607750238944, 0.09791695848851388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2529794-c0b7-4866-baf1-a497c0b4d1b8", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.1634968891402715, 0.6239394796380091], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 623.1363636363636, 87, 1306, 657.0, 889.4, 1244.9499999999991, 1306.0, 0.09711609346099685, 0.03055570270115171, 0.04381604997947319], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa2e42fe-47f1-45fb-aa80-e5260ea1b7a8", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 226.11111111111111, 163, 485, 165.0, 340.10000000000025, 485.0, 485.0, 0.10834823121512542, 0.16791859661953518, 0.24367771141448616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 95.91666666666667, 81, 246, 82.5, 197.40000000000018, 246.0, 246.0, 0.06737144685796415, 0.05230498071492334, 0.023948444000291943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 308.2352941176471, 162, 1032, 320.0, 466.3999999999995, 1032.0, 1032.0, 0.07801278491875198, 5.603816804183321, 0.17427844627213612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=775d128c-8464-4fd6-a233-fef5bf3839cc", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 96.1818181818182, 80, 245, 81.0, 212.6000000000001, 245.0, 245.0, 0.05762511197606986, 0.04282491231815348, 0.028925105034863192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b83c4e15-c1dd-4327-8cfa-ac38c57d5aa9", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 94.99999999999999, 78, 243, 80.0, 210.80000000000013, 243.0, 243.0, 0.05762722519671839, 0.023288274955207928, 0.03242554627990067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 174.1818181818182, 80, 950, 81.0, 808.0000000000005, 950.0, 950.0, 0.05762631951174791, 4.727962230204049, 0.03342776737302564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 144.81818181818184, 80, 472, 81.0, 425.60000000000014, 472.0, 472.0, 0.05762662140357495, 1.5544965299606044, 0.03348421849133505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 3.6865234375, 7.72705078125], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 970.5818181818182, 639, 1593, 954.0, 1276.8, 1328.3999999999992, 1593.0, 0.2501591922132266, 299.27736329368685, 0.49396668618666423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 623.1363636363636, 87, 1306, 657.0, 889.4, 1244.9499999999991, 1306.0, 0.0958029594405107, 0.030142550448967506, 0.04322360084132417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 80.6, 80, 81, 81.0, 81.0, 81.0, 81.0, 0.024950971341314316, 0.006725066494338625, 0.014692808319152864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.0, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.02495084683174147, 0.006725032935117818, 0.014668368938191761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 280.0833333333333, 79, 938, 82.5, 881.6000000000001, 938.0, 938.0, 0.06598772628291139, 14.857307341615709, 0.037375860589930275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 205.75, 78, 716, 82.0, 642.8000000000003, 716.0, 716.0, 0.06607274609344889, 4.870251795664527, 0.03748854050809942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 80.8, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.024951220364188013, 0.006676400761511245, 0.014229992863950977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 80.66666666666666, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.06618717733751048, 0.04918793159555222, 0.033222860499492565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 81.8, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.02495059781632368, 0.018542387634982737, 0.012524030544521848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 119.83333333333336, 79, 240, 81.5, 238.8, 240.0, 240.0, 0.06618754240139435, 0.04256298503058416, 0.03635790293045344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 114.0, 82, 240, 83.0, 240.0, 240.0, 240.0, 0.023993588913042437, 0.01888557877335176, 0.008528971058933053], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 445.53846153846155, 80, 776, 430.0, 712.8, 776.0, 776.0, 0.07362977814781461, 0.013794521236527166, 0.050111612831971186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 972.8636363636364, 714, 1304, 967.5, 1245.2, 1296.35, 1304.0, 0.09382863479336376, 0.04856364886765897, 0.04315750682390071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 164.2, 162, 168, 164.0, 168.0, 168.0, 168.0, 0.024940392462015782, 0.038652737145721726, 0.05609152718752182], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 937.8333333333336, 410, 3087, 685.5, 1483.5, 2668.749999999998, 3087.0, 0.27309098026007367, 88.18256654743591, 0.9921061060867429], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2b4b1572-c29e-4a0a-8ad4-678c35500bb6", 3, 0, 0.0, 308.3333333333333, 177, 487, 261.0, 487.0, 487.0, 487.0, 0.031824160902957525, 0.026530493513175202, 0.020408071933211695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93d777ca-c908-4002-894d-4e8b0c3e833c", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.92727272727276, 80, 409, 82.0, 327.2, 330.59999999999997, 409.0, 0.25096736511644885, 0.18650992661486093, 0.12131723216078338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87d84620-4525-4ec0-bcb3-8beaea8c97e8", 2, 0, 0.0, 193.0, 181, 205, 193.0, 205.0, 205.0, 205.0, 0.06978123582568647, 0.0409896614737797, 0.04337476230766547], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 532.2727272727271, 394, 796, 478.0, 710.4, 720.2, 796.0, 0.2509238560153292, 73.77994512466354, 0.1261970564920845], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 125.8, 79, 275, 83.0, 241.0, 242.2, 275.0, 0.2512861280919616, 0.4446586563502289, 0.1222075115134735], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 817.9454545454546, 549, 1265, 790.0, 1030.0, 1110.2, 1265.0, 0.2505683345406171, 225.46182787179785, 0.1257735585487082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 83.94117647058822, 80, 90, 83.0, 87.6, 90.0, 90.0, 0.07845417583888281, 0.05861078566088413, 0.027888007817727874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e45ae90-15f0-430c-802c-dbed63ecc8d9", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 163.2342857142858, 80, 1934, 84.0, 254.60000000000002, 314.79999999999984, 1832.9200000000012, 0.7530120481927711, 1.6050376169858003, 0.3630845928356282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 96.63636363636363, 81, 241, 82.0, 209.40000000000012, 241.0, 241.0, 0.056450785179102944, 0.0437162818818639, 0.020066490044134248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b4b1572-c29e-4a0a-8ad4-678c35500bb6", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 102.94444444444444, 82, 243, 83.5, 240.3, 243.0, 243.0, 0.17440846462414974, 0.14153655674088716, 0.061996758909365735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92ff0548-49e7-4ef7-9786-902fb368f29c", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 285.5454545454545, 162, 1031, 163.0, 922.0000000000005, 1031.0, 1031.0, 0.05760067026234487, 6.345738614049327, 0.12820546911818612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 375.0, 162, 1018, 241.5, 961.9000000000002, 1018.0, 1018.0, 0.06595725969571718, 19.803618915099264, 0.14412047711832732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa2e42fe-47f1-45fb-aa80-e5260ea1b7a8", 3, 0, 0.0, 284.3333333333333, 174, 497, 182.0, 497.0, 497.0, 497.0, 0.027943107832453126, 0.028024972406181015, 0.017919245582660368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 107.90476190476191, 81, 421, 83.0, 213.4000000000001, 403.09999999999974, 421.0, 0.11253114701390562, 0.09329974981914636, 0.04000130616509927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 100.53846153846153, 81, 244, 85.0, 196.79999999999995, 244.0, 244.0, 0.07293536804308796, 0.05662462655688959, 0.025926244109066427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9d23049-d937-498f-80d2-bace46e83a61", 3, 0, 0.0, 493.0, 200, 834, 445.0, 834.0, 834.0, 834.0, 0.05434684154272567, 0.03493978256734479, 0.03485132742160468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b83c4e15-c1dd-4327-8cfa-ac38c57d5aa9", 3, 0, 0.0, 523.0, 258, 907, 404.0, 907.0, 907.0, 907.0, 0.023210472565221428, 0.02327847199656485, 0.014884319971837959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07caf301-89fa-41b8-94d0-9e54859f08ca", 3, 0, 0.0, 265.0, 179, 407, 209.0, 407.0, 407.0, 407.0, 0.016949248300837858, 0.02336590708139594, 0.010869146859586778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97182119-33c9-45ce-872d-eb45adf12fac", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2529794-c0b7-4866-baf1-a497c0b4d1b8", 3, 0, 0.0, 494.0, 291, 776, 415.0, 776.0, 776.0, 776.0, 0.020200931936326664, 0.027848615478627412, 0.012954373670105313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 90.88235294117648, 80, 241, 81.0, 115.39999999999989, 241.0, 241.0, 0.07809879957551007, 0.05804022116890933, 0.039201936505675945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26fd3fbc-297b-4899-ac2b-a11f0d7325b8", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 146.0, 79, 242, 82.0, 241.2, 242.0, 242.0, 0.07810095237220158, 0.027798339895344724, 0.04415611059554273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 178.58823529411765, 79, 790, 83.0, 351.5999999999996, 790.0, 790.0, 0.07804322676607231, 4.150587884994124, 0.04548636137227537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 159.6470588235294, 79, 633, 81.0, 319.39999999999975, 633.0, 633.0, 0.07810059356451109, 1.3706456765578772, 0.045596066888564234], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.45941807044410415], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07656967840735068], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07656967840735068], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8422664624808576], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

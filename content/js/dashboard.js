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

    var data = {"OkPercent": 97.38348323793949, "KoPercent": 2.616516762060507};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6770906535488405, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06363636363636363, 500, 1500, "see books"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c2dd6b3e-6d8a-4c06-95c6-ed27163cc965"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/d055392f-5d1c-470c-acfb-1d4584442e93"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.025, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c7729841-01b5-411c-b494-93fd48a044ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1edf5d9a-beec-4207-b4a3-2deb3a73a375"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be92f5da-9938-4e25-8799-e10904ed577c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.11, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bb609f04-c21f-41a9-a163-860319aaaa51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0fd0060b-6d12-47d8-b081-49df99ac7695"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b664f35-26cb-4d66-9cd9-4cba84711bc6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7729841-01b5-411c-b494-93fd48a044ef"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7064516129032258, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6b664f35-26cb-4d66-9cd9-4cba84711bc6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fd0060b-6d12-47d8-b081-49df99ac7695"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb609f04-c21f-41a9-a163-860319aaaa51"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c32a6e5-1376-4172-b70e-9c68aee76603"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50a48d84-4fbb-434f-a0d5-e71b5ade227e"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f26ebe6-5514-4fa5-8fde-d69c1ba767ae"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f26ebe6-5514-4fa5-8fde-d69c1ba767ae"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0c32a6e5-1376-4172-b70e-9c68aee76603"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/50a48d84-4fbb-434f-a0d5-e71b5ade227e"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be92f5da-9938-4e25-8799-e10904ed577c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/acd7c108-53cd-4b1d-9f07-f2b926c3727e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1edf5d9a-beec-4207-b4a3-2deb3a73a375"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d055392f-5d1c-470c-acfb-1d4584442e93"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6793841-ff91-40f2-9518-fd18bfcd974e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1223, 32, 2.616516762060507, 599.2616516762052, 97, 15051, 210.0, 1332.6000000000001, 1979.3999999999985, 4538.879999999997, 4.920360960576764, 715.5203609228594, 3.6071627800140007], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2250.490909090909, 1228, 4276, 2101.0, 3326.0, 3653.7999999999997, 4276.0, 0.24280631119822707, 292.1772712667978, 1.1938767352373763], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 348.2941176470589, 201, 977, 211.0, 673.7999999999997, 977.0, 977.0, 0.09577680623788705, 6.879842538705097, 0.2139627882459323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 629.2857142857142, 102, 1791, 340.0, 1722.5, 1791.0, 1791.0, 0.08949346697691068, 0.06947979125648827, 0.03181213083944872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 341.26666666666665, 202, 624, 262.0, 618.0, 624.0, 624.0, 0.09628902112581124, 0.14922917629556878, 0.2165562652858821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.44444444444444, 101, 310, 104.0, 310.0, 310.0, 310.0, 0.05619977145426275, 0.04176565046552144, 0.028209650905752982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 105.0, 100, 116, 103.0, 116.0, 116.0, 116.0, 0.056199420521530624, 0.015037735569237685, 0.032051232016185434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 127.7777777777778, 100, 302, 105.0, 302.0, 302.0, 302.0, 0.05620187714269657, 0.015148162198617433, 0.033040556679593096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 127.55555555555559, 99, 293, 104.0, 293.0, 293.0, 293.0, 0.0562004733328754, 0.015147783828001575, 0.03309461466769909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2dd6b3e-6d8a-4c06-95c6-ed27163cc965", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.44475757311977715, 0.8310302054317549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 735.3333333333333, 125, 1453, 628.0, 1453.0, 1453.0, 1453.0, 0.04930075101477379, 0.01453986992818524, 0.030475952531593565], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1160.8545454545451, 794, 1925, 1031.0, 1663.6, 1735.6, 1925.0, 0.2497411773253174, 298.7772721622591, 0.49314127007010916], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 1633.0769230769233, 110, 3288, 1672.0, 2926.7999999999997, 3288.0, 3288.0, 0.09425002356250589, 0.019512700190675046, 0.06301979114557278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 1633.0769230769233, 110, 3288, 1672.0, 2926.7999999999997, 3288.0, 3288.0, 0.09321000932100093, 0.019297384742238473, 0.0623243909980641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d055392f-5d1c-470c-acfb-1d4584442e93", 3, 0, 0.0, 1859.3333333333333, 932, 3571, 1075.0, 3571.0, 3571.0, 3571.0, 0.03030456083640588, 0.025263665462902166, 0.019433588817617052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 2220.913043478261, 737, 4910, 1884.0, 4106.800000000001, 4787.199999999998, 4910.0, 0.09431795813922972, 0.029282137819040745, 0.04255361001984778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 121.0909090909091, 99, 304, 104.0, 264.60000000000014, 304.0, 304.0, 0.05651720435079715, 0.015233152735175793, 0.03328112717141668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 180.3076923076923, 97, 323, 103.0, 316.6, 323.0, 323.0, 0.09162349790323149, 0.03510215139021038, 0.05166210751665081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 138.9090909090909, 99, 311, 102.0, 309.8, 311.0, 311.0, 0.05651720435079715, 0.015233152735175793, 0.033225934589042855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 110.53846153846153, 97, 176, 105.0, 151.59999999999997, 176.0, 176.0, 0.0917470041074428, 0.06818307629469138, 0.046052695421118756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 209.9230769230769, 100, 806, 123.0, 605.5999999999998, 806.0, 806.0, 0.09161445817095257, 2.0949237001317838, 0.053343123894460144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 210.23076923076923, 99, 1229, 105.0, 855.7999999999996, 1229.0, 1229.0, 0.0917476516129943, 6.373188039017453, 0.05333107934054611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 132.64285714285714, 100, 305, 103.0, 304.0, 305.0, 305.0, 0.08679533041122388, 0.023394053899900184, 0.05102616104253591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 166.2857142857143, 99, 396, 104.0, 352.5, 396.0, 396.0, 0.0868001736003472, 0.023395359290718582, 0.05111377410254821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 138.63636363636365, 99, 312, 103.0, 309.0, 312.0, 312.0, 0.05646034687184015, 0.015107553752816602, 0.03220004157534633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 104.07142857142857, 102, 108, 103.5, 107.5, 108.0, 108.0, 0.08690146615187894, 0.06458204662263659, 0.04362046250201736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 123.27272727272727, 100, 315, 104.0, 274.0000000000001, 315.0, 315.0, 0.05651575248155531, 0.0420004762094371, 0.028368258569843194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 133.2142857142857, 101, 312, 104.0, 309.5, 312.0, 312.0, 0.08690362388111585, 0.0232535087338142, 0.049562222994698875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 316.72727272727275, 105, 1232, 141.0, 1146.2000000000003, 1232.0, 1232.0, 0.055725546616952726, 0.04386210016920303, 0.019808690398994914], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 1746.3846153846155, 102, 3669, 1828.0, 3491.0, 3669.0, 3669.0, 0.09512519939705259, 0.01909363978282185, 0.06472686719790431], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 5941.05, 1162, 15051, 4724.5, 12699.600000000004, 14942.099999999999, 15051.0, 0.08708184387096213, 0.04507165747227532, 0.04005424654611636], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 566.6923076923077, 103, 1075, 503.0, 1023.8, 1075.0, 1075.0, 0.09523111859937002, 0.15892122143066442, 0.06154396884843601], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 282.7272727272727, 206, 627, 208.0, 584.6000000000001, 627.0, 627.0, 0.056429355576759314, 0.08745447978546585, 0.12691094325515304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7729841-01b5-411c-b494-93fd48a044ef", 3, 0, 0.0, 2446.3333333333335, 587, 3528, 3224.0, 3528.0, 3528.0, 3528.0, 0.01494835343886871, 0.020607511983596675, 0.009586020922712029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1edf5d9a-beec-4207-b4a3-2deb3a73a375", 3, 0, 0.0, 1640.6666666666665, 347, 3669, 906.0, 3669.0, 3669.0, 3669.0, 0.0405569825604975, 0.02607423195214276, 0.026008221238339867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be92f5da-9938-4e25-8799-e10904ed577c", 3, 0, 0.0, 827.0, 194, 1828, 459.0, 1828.0, 1828.0, 1828.0, 0.07116593523899893, 0.032200732416083504, 0.04563700925157158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 115.94117647058826, 98, 296, 105.0, 149.59999999999985, 296.0, 296.0, 0.09594004311658408, 0.07129919219894579, 0.048157404455004126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 131.2941176470588, 99, 309, 104.0, 306.6, 309.0, 309.0, 0.09594220892826909, 0.03414854816863254, 0.054243061826288165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 764.7142857142857, 579, 816, 800.0, 816.0, 816.0, 816.0, 0.06727017624786177, 19.77966539694209, 0.03836502239135866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1017.0, 785, 1172, 1107.0, 1172.0, 1172.0, 1172.0, 0.06705494673921374, 60.33615894596809, 0.03817679096578282], "isController": false}, {"data": ["addBook", 50, 11, 22.0, 2271.2000000000003, 733, 5794, 1910.5, 4097.2, 5103.9999999999945, 5794.0, 0.2674826671231704, 77.85728746495977, 0.9728062492644227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 260.8571428571429, 102, 388, 303.0, 388.0, 388.0, 388.0, 0.06770611676403451, 0.11980808943010794, 0.037489617387898015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb609f04-c21f-41a9-a163-860319aaaa51", 3, 0, 0.0, 1149.6666666666665, 257, 2689, 503.0, 2689.0, 2689.0, 2689.0, 0.03548825930088129, 0.02958510158514225, 0.022757770450109422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 126.99999999999997, 102, 302, 106.0, 302.0, 302.0, 302.0, 0.04606077975782266, 0.03423071620674125, 0.023120352339375826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 103.11111111111111, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.04606148696715816, 0.012325046317384118, 0.02626944178595739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 147.55555555555554, 99, 308, 102.0, 308.0, 308.0, 308.0, 0.04606195845211348, 0.01241513723904621, 0.02707939354313702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fd0060b-6d12-47d8-b081-49df99ac7695", 3, 0, 0.0, 965.6666666666667, 489, 1544, 864.0, 1544.0, 1544.0, 1544.0, 0.021378332347554676, 0.025268465089183276, 0.013709412345274318], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 195.29090909090917, 100, 480, 106.0, 412.4, 430.4, 480.0, 0.2507899884636606, 0.1863781066609821, 0.12123148856397653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 125.55555555555556, 100, 304, 104.0, 304.0, 304.0, 304.0, 0.04606242994672112, 0.012415264321577177, 0.027124653572141444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b664f35-26cb-4d66-9cd9-4cba84711bc6", 1, 0, 0.0, 2510.0, 2510, 2510, 2510.0, 2510.0, 2510.0, 2510.0, 0.39840637450199207, 0.0719777141434263, 0.2746825199203187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7729841-01b5-411c-b494-93fd48a044ef", 1, 0, 0.0, 2038.0, 2038, 2038, 2038.0, 2038.0, 2038.0, 2038.0, 0.4906771344455348, 0.08864772448478901, 0.33829888370951916], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 648.909090909091, 490, 919, 609.0, 838.1999999999999, 889.8, 919.0, 0.25075111356289975, 73.72915310806005, 0.12611017918446618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 134.57142857142858, 102, 305, 109.0, 305.0, 305.0, 305.0, 0.06770284255220373, 0.05031431951389359, 0.03801673287843471], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 169.30909090909086, 100, 410, 109.0, 309.0, 364.2, 410.0, 0.25119316754584275, 0.44449415975885453, 0.12216230218538054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 721.0, 100, 1333, 1035.0, 1272.2, 1333.0, 1333.0, 0.10255420291253936, 54.292824203244336, 0.05510638867439644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 182.1176470588235, 97, 866, 103.0, 417.1999999999996, 866.0, 866.0, 0.09583295751781365, 5.096702544717349, 0.05585484759741138], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 964.3272727272725, 691, 1441, 918.0, 1248.3999999999999, 1293.9999999999998, 1441.0, 0.25026049842790904, 225.18483639646496, 0.12561903924994655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 545.1764705882352, 99, 922, 788.0, 921.2, 922.0, 922.0, 0.10255605895163576, 17.749550563153417, 0.05520753839819501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 486.79999999999995, 102, 1725, 128.0, 1560.0, 1725.0, 1725.0, 0.0933701004039813, 0.06975403008695868, 0.033190152877977726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 216.11764705882354, 100, 820, 104.0, 415.99999999999966, 820.0, 820.0, 0.09583511849730535, 1.6818821065968386, 0.05594969607583376], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 1680.1538461538462, 125, 3398, 1915.0, 3042.7999999999997, 3398.0, 3398.0, 0.09317794119755157, 0.0192907456385556, 0.06270892241502889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 11, 7.096774193548387, 592.0645161290319, 102, 4358, 262.0, 1705.4, 2501.1999999999994, 3991.1999999999985, 0.6976262703549342, 1.5978683157276468, 0.32979455609590336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 265.0, 105, 856, 113.0, 856.0, 856.0, 856.0, 0.05298075621199366, 0.04102904265245213, 0.018833003184732123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 277.0, 206, 610, 211.0, 610.0, 610.0, 610.0, 0.046036276585949734, 0.07134723724795139, 0.10353666501703343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b664f35-26cb-4d66-9cd9-4cba84711bc6", 3, 0, 0.0, 1181.6666666666665, 479, 2378, 688.0, 2378.0, 2378.0, 2378.0, 0.044820940343328404, 0.028815545956404162, 0.028742595207147444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fd0060b-6d12-47d8-b081-49df99ac7695", 1, 0, 0.0, 3398.0, 3398, 3398, 3398.0, 3398.0, 3398.0, 3398.0, 0.2942907592701589, 0.053167764125956446, 0.20289968363743377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb609f04-c21f-41a9-a163-860319aaaa51", 1, 0, 0.0, 2202.0, 2202, 2202, 2202.0, 2202.0, 2202.0, 2202.0, 0.45413260672116257, 0.08204544164396003, 0.31310314486830154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 342.7692307692308, 103, 1150, 114.0, 1075.6, 1150.0, 1150.0, 0.09218223719198723, 0.07480804600248182, 0.03276790462683921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c32a6e5-1376-4172-b70e-9c68aee76603", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 0.17075998345935728, 0.651657017958412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50a48d84-4fbb-434f-a0d5-e71b5ade227e", 1, 0, 0.0, 1665.0, 1665, 1665, 1665.0, 1665.0, 1665.0, 1665.0, 0.6006006006006006, 0.10850694444444445, 0.41408596096096095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1435.15, 165, 3839, 1105.0, 3583.7000000000007, 3828.35, 3839.0, 0.0900718322862483, 0.05532732666801775, 0.040725838230989214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 117.47058823529412, 100, 218, 105.0, 188.39999999999998, 218.0, 218.0, 0.10255172829824456, 0.07621275901851964, 0.051476160493454784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 142.05882352941177, 99, 348, 104.0, 320.79999999999995, 348.0, 348.0, 0.10255296559046377, 0.11804666386154143, 0.05342085776506925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f26ebe6-5514-4fa5-8fde-d69c1ba767ae", 3, 0, 0.0, 916.3333333333334, 339, 1953, 457.0, 1953.0, 1953.0, 1953.0, 0.04048582995951417, 0.026028487685560056, 0.025962592780026994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f26ebe6-5514-4fa5-8fde-d69c1ba767ae", 1, 0, 0.0, 2175.0, 2175, 2175, 2175.0, 2175.0, 2175.0, 2175.0, 0.45977011494252873, 0.0830639367816092, 0.31698994252873564], "isController": false}, {"data": ["login", 20, 0, 0.0, 8493.0, 2420, 17519, 8409.0, 16407.300000000007, 17478.7, 17519.0, 0.0872722195070865, 36.659663127869074, 0.18232564374170912], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 256.22222222222223, 205, 612, 211.0, 612.0, 612.0, 612.0, 0.0561629474314812, 0.08704159919312567, 0.12631178509248167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c32a6e5-1376-4172-b70e-9c68aee76603", 3, 0, 0.0, 1009.0, 574, 1506, 947.0, 1506.0, 1506.0, 1506.0, 0.018573781250386955, 0.025605456899540607, 0.011910920919030695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50a48d84-4fbb-434f-a0d5-e71b5ade227e", 3, 0, 0.0, 1225.0, 225, 2670, 780.0, 2670.0, 2670.0, 2670.0, 0.04756468797564688, 0.030579511312468288, 0.030502094828132927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 364.88235294117646, 101, 1597, 114.0, 1281.7999999999997, 1597.0, 1597.0, 0.09441087613293052, 0.07643224249433535, 0.03356011612537765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 288.7142857142857, 207, 499, 213.5, 457.0, 499.0, 499.0, 0.08673832904804683, 0.1344274689445804, 0.1950765349586444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be92f5da-9938-4e25-8799-e10904ed577c", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd7c108-53cd-4b1d-9f07-f2b926c3727e", 1, 0, 0.0, 1251.0, 1251, 1251, 1251.0, 1251.0, 1251.0, 1251.0, 0.7993605115907274, 0.25526453836930457, 0.4769621802557954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1edf5d9a-beec-4207-b4a3-2deb3a73a375", 1, 0, 0.0, 2125.0, 2125, 2125, 2125.0, 2125.0, 2125.0, 2125.0, 0.47058823529411764, 0.08501838235294118, 0.3244485294117647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d055392f-5d1c-470c-acfb-1d4584442e93", 1, 0, 0.0, 1915.0, 1915, 1915, 1915.0, 1915.0, 1915.0, 1915.0, 0.5221932114882506, 0.09434154699738903, 0.3600277415143603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 351.44444444444446, 107, 1678, 117.0, 1678.0, 1678.0, 1678.0, 0.047443831774715596, 0.03933575505540385, 0.016864799576168436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 840.8823529411765, 204, 1515, 1141.0, 1391.0, 1515.0, 1515.0, 0.10248743021811736, 72.1892834037432, 0.21507170917383076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 216.05882352941177, 101, 1412, 112.0, 594.3999999999993, 1412.0, 1412.0, 0.09766522658332567, 0.07582407727904679, 0.03471693601204155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 381.3846153846154, 201, 1332, 234.0, 991.9999999999998, 1332.0, 1332.0, 0.09154929577464789, 8.555952904929578, 0.20409468529929578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 670.5384615384615, 102, 1277, 927.0, 1257.4, 1277.0, 1277.0, 0.12440072343805321, 80.15271684003024, 0.1890868568243366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 135.40000000000003, 100, 316, 104.0, 311.2, 316.0, 316.0, 0.0964791540707771, 0.07169984008580213, 0.04842801288318305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6793841-ff91-40f2-9518-fd18bfcd974e", 1, 0, 0.0, 2058.0, 2058, 2058, 2058.0, 2058.0, 2058.0, 2058.0, 0.48590864917395526, 0.15516809402332363, 0.2899318209426628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 151.73333333333332, 100, 429, 104.0, 354.6, 429.0, 429.0, 0.09647729246126437, 0.025815213021861756, 0.05502220585681483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 156.13333333333333, 99, 307, 103.0, 306.4, 307.0, 307.0, 0.09635272806690733, 0.025970071236783618, 0.0566448655237092], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 2220.913043478261, 737, 4910, 1884.0, 4106.800000000001, 4787.199999999998, 4910.0, 0.09178522257916476, 0.028495819781710795, 0.041410910968334096], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 166.39999999999998, 99, 432, 103.0, 357.00000000000006, 432.0, 432.0, 0.09647667194072473, 0.02600347798402346, 0.056811946465094736], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 28.125, 0.7358953393295176], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.24529844644317253], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.24529844644317253], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.3900245298446443], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1223, 32, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

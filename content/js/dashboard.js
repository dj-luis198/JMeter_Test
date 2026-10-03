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

    var data = {"OkPercent": 98.72102318145484, "KoPercent": 1.2789768185451638};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7701307639366827, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.009615384615384616, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/052c477a-22d1-423b-9a52-5d73efa29aa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1853e96-f1ec-4e50-937b-0f923f728486"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e4002fd-44b2-4f8a-be64-bce127e9277c"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6bf232c6-bd53-4bc5-8de7-1bfffe4c47ce"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb7f0487-b316-4da4-b251-e0cb0905db43"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d42babf1-0d31-4651-869f-6124162ce3f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8474ebe-67ba-40d9-89be-73324ff93178"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=967d50c1-0bcd-4eba-af9a-e841931c5ab4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02158e8f-ba4f-4a84-a4c2-3634fe8be9b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21ebcd28-b135-4cd6-9ba7-bf77e262905e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8f06306-42ae-4f0e-8ab4-c02ab67cb36b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5b953ca-b04c-45ff-9c9d-3c7f665aca6f"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=052c477a-22d1-423b-9a52-5d73efa29aa6"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1853e96-f1ec-4e50-937b-0f923f728486"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91084514-730a-4e28-81c7-fad34f16939b"], "isController": false}, {"data": [0.319672131147541, 500, 1500, "addBook"], "isController": true}, {"data": [0.9711538461538461, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9425287356321839, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e4002fd-44b2-4f8a-be64-bce127e9277c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02158e8f-ba4f-4a84-a4c2-3634fe8be9b2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb7f0487-b316-4da4-b251-e0cb0905db43"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b6a8332-b282-4a0d-80e9-19343024be60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/967d50c1-0bcd-4eba-af9a-e841931c5ab4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c0bcb215-f3c2-480e-9c1f-32fe599868ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d42babf1-0d31-4651-869f-6124162ce3f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8f06306-42ae-4f0e-8ab4-c02ab67cb36b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bf232c6-bd53-4bc5-8de7-1bfffe4c47ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0deb6de6-02ae-400f-a790-61671cf187b6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21ebcd28-b135-4cd6-9ba7-bf77e262905e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5b953ca-b04c-45ff-9c9d-3c7f665aca6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1251, 16, 1.2789768185451638, 410.19744204636277, 111, 2831, 133.0, 1152.799999999999, 1406.3999999999999, 1983.3200000000002, 4.84356185704717, 651.5941462798754, 3.536830404675528], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 1963.884615384616, 1497, 2979, 1902.5, 2458.7000000000003, 2602.7999999999993, 2979.0, 0.2399033005157921, 288.68504697433497, 1.1796026543916145], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 727.0, 121, 1952, 551.0, 1747.4000000000008, 1952.0, 1952.0, 0.06637718837292918, 0.012623981870730426, 0.04485105754072517], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 727.0, 121, 1952, 551.0, 1747.4000000000008, 1952.0, 1952.0, 0.06750105470397975, 0.01283772500351568, 0.04561045387427928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 131.94444444444446, 111, 350, 117.5, 161.9000000000003, 350.0, 350.0, 0.10275908133381288, 0.027496082310024147, 0.05860478857319015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 118.11111111111111, 112, 129, 118.0, 128.1, 129.0, 129.0, 0.10275556164477402, 0.07636424063639945, 0.05157847527872446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 184.05555555555554, 114, 389, 118.0, 356.6, 389.0, 389.0, 0.10275732145915396, 0.027696309299537595, 0.060510414882685395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 130.83333333333334, 113, 352, 116.0, 156.7000000000003, 352.0, 352.0, 0.10276318794245261, 0.027697890500114182, 0.06041351478648093], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 311.5, 116, 507, 249.0, 505.2, 507.0, 507.0, 0.06652696005056048, 0.17028584590415685, 0.04300322621106787], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 120.41176470588235, 114, 132, 120.0, 128.8, 132.0, 132.0, 0.09917856809483805, 0.07370594757829274, 0.04978299218822926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 174.2941176470588, 113, 380, 119.0, 358.4, 380.0, 380.0, 0.09917798948713312, 0.026537860468236793, 0.056562447129380605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 813.0, 667, 919, 853.0, 919.0, 919.0, 919.0, 0.021053370293694515, 6.19038990403172, 0.012007000245622653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1253.3333333333333, 1018, 1411, 1331.0, 1411.0, 1411.0, 1411.0, 0.020944016643511896, 18.845462991486258, 0.011924181350749446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 265.3333333333333, 117, 340, 339.0, 340.0, 340.0, 340.0, 0.021101943488995335, 0.037340548439511276, 0.011684376912363629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/052c477a-22d1-423b-9a52-5d73efa29aa6", 3, 0, 0.0, 572.0, 494, 668, 554.0, 668.0, 668.0, 668.0, 0.018872553645233735, 0.026017338765483355, 0.01210251649775731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 135.28571428571428, 114, 341, 119.5, 234.5, 341.0, 341.0, 0.09165602802055714, 0.06811546613637108, 0.04600702969000622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 170.42857142857144, 113, 373, 117.0, 365.5, 373.0, 373.0, 0.09151343613342659, 0.034304771608610105, 0.05164227806357569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 239.42857142857144, 112, 1353, 118.5, 852.0, 1353.0, 1353.0, 0.09166022862679883, 5.91408597770365, 0.05332354260236483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 231.57142857142858, 116, 748, 121.0, 565.5, 748.0, 748.0, 0.09149848373941231, 1.9445853117157272, 0.0533188011411168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1853e96-f1ec-4e50-937b-0f923f728486", 3, 0, 0.0, 408.3333333333333, 308, 528, 389.0, 528.0, 528.0, 528.0, 0.024879335224162812, 0.02495222390157735, 0.0159545216118492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 116.33333333333333, 114, 118, 117.0, 118.0, 118.0, 118.0, 0.021134946634259747, 0.015706732801437178, 0.011867767885448589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1081.6153846153848, 118, 1519, 1357.0, 1505.4, 1519.0, 1519.0, 0.07399312433121598, 51.21932798234979, 0.038608491707078293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 147.9411764705882, 114, 379, 118.0, 353.4, 379.0, 379.0, 0.09917162524792907, 0.026729852117605882, 0.058302068749270804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 725.8461538461539, 117, 1124, 906.0, 1101.6, 1124.0, 1124.0, 0.07399354548610913, 16.74041712438315, 0.03868097078108725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 144.58823529411765, 114, 360, 117.0, 353.6, 360.0, 360.0, 0.09917741088617933, 0.026731411527915524, 0.05840232301207631], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 548.0, 118, 1009, 488.5, 1005.7, 1009.0, 1009.0, 0.06751510650508052, 0.012840397452992607, 0.04614741044402435], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e4002fd-44b2-4f8a-be64-bce127e9277c", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 431.35714285714283, 233, 1480, 249.5, 1086.5, 1480.0, 1480.0, 0.09142618315276663, 7.944250384887906, 0.20394875399173248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bf232c6-bd53-4bc5-8de7-1bfffe4c47ce", 3, 0, 0.0, 1068.3333333333335, 215, 2716, 274.0, 2716.0, 2716.0, 2716.0, 0.020160748366979384, 0.02382932204443429, 0.012928604909814252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 645.0, 136, 1237, 709.0, 1081.0, 1237.0, 1237.0, 0.0820450816132654, 0.05039683235814837, 0.03709655545599792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 121.15384615384616, 114, 141, 119.0, 135.79999999999998, 141.0, 141.0, 0.0739943878102784, 0.05498996984728697, 0.037141714193831145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 212.23076923076923, 114, 380, 129.0, 372.0, 380.0, 380.0, 0.0739943878102784, 0.10528858878472756, 0.03741963782593105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb7f0487-b316-4da4-b251-e0cb0905db43", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["login", 19, 0, 0.0, 2752.368421052631, 1815, 5236, 2447.0, 4250.0, 5236.0, 5236.0, 0.08242628270479678, 15.685536037909584, 0.14594485058067147], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d42babf1-0d31-4651-869f-6124162ce3f8", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 152.11764705882354, 114, 356, 129.0, 351.2, 356.0, 356.0, 0.09284493257819455, 0.07516450108137039, 0.03300347212740509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8474ebe-67ba-40d9-89be-73324ff93178", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1222.6923076923076, 238, 1635, 1477.0, 1627.4, 1635.0, 1635.0, 0.07394430287586458, 68.07497938980309, 0.15174912937693394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=967d50c1-0bcd-4eba-af9a-e841931c5ab4", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02158e8f-ba4f-4a84-a4c2-3634fe8be9b2", 3, 0, 0.0, 582.3333333333334, 231, 1051, 465.0, 1051.0, 1051.0, 1051.0, 0.04722773212430339, 0.030362881167154687, 0.030286013113566955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21ebcd28-b135-4cd6-9ba7-bf77e262905e", 3, 0, 0.0, 339.3333333333333, 232, 467, 319.0, 467.0, 467.0, 467.0, 0.023376866253155878, 0.023445353166006922, 0.014991024257394884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8f06306-42ae-4f0e-8ab4-c02ab67cb36b", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 320.0, 231, 510, 245.5, 480.30000000000007, 510.0, 510.0, 0.10268053234151545, 0.159134770337876, 0.23093092381104502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 870.0, 116, 1526, 1136.0, 1526.0, 1526.0, 1526.0, 0.03371589637082092, 24.205168815493128, 0.05455126670622665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5b953ca-b04c-45ff-9c9d-3c7f665aca6f", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1324.9545454545455, 271, 2831, 1333.5, 1955.1999999999998, 2710.249999999998, 2831.0, 0.08617549247335415, 0.02711345395290901, 0.03887995851825158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 135.75, 116, 344, 121.0, 196.30000000000015, 344.0, 344.0, 0.07919302309466536, 0.06148286460962789, 0.028150644928181826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 340.5882352941176, 234, 505, 255.0, 500.2, 505.0, 505.0, 0.0991051388929373, 0.1535936088116128, 0.2228897801469088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=052c477a-22d1-423b-9a52-5d73efa29aa6", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 473.68750000000006, 243, 1353, 467.5, 761.5000000000006, 1353.0, 1353.0, 0.091755746203606, 6.994051512607813, 0.20489353824494197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 165.1, 113, 374, 118.0, 370.7, 374.0, 374.0, 0.056600142632359435, 0.04206319193674368, 0.028410618469758543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 188.5, 113, 377, 115.5, 375.2, 377.0, 377.0, 0.05660142409183015, 0.023646571510239196, 0.031805136154725654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 245.70000000000002, 113, 1392, 118.0, 1265.5000000000005, 1392.0, 1392.0, 0.056602064843325486, 5.10679416694496, 0.03278939928228582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 222.60000000000002, 114, 691, 124.5, 657.5000000000001, 691.0, 691.0, 0.056602064843325486, 1.6780190656980167, 0.032844674736234376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 2.4993379237288136, 5.238678495762712], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1346.4038461538462, 897, 2407, 1240.5, 1952.9000000000003, 2101.2999999999993, 2407.0, 0.24075300131025193, 288.02428885267307, 0.4753931334466107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1324.9545454545455, 271, 2831, 1333.5, 1955.1999999999998, 2710.249999999998, 2831.0, 0.08517854584735231, 0.026799783956233714, 0.038430164239723404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 180.77777777777777, 112, 465, 119.0, 465.0, 465.0, 465.0, 0.08814110411423087, 0.02375678196828879, 0.05190340408289181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 171.22222222222223, 114, 347, 125.0, 347.0, 347.0, 347.0, 0.08793871648557805, 0.02370223217775346, 0.051698346996404285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 271.0625, 112, 1270, 117.0, 1217.5, 1270.0, 1270.0, 0.07694268251044738, 8.672291271934675, 0.04440734898796328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 217.43750000000003, 114, 902, 118.0, 741.7000000000002, 902.0, 902.0, 0.07707908796169169, 2.8511547109775073, 0.04456134772785301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 118.1875, 113, 128, 117.0, 126.6, 128.0, 128.0, 0.07726967599858982, 0.05742404632317076, 0.03878575533522966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 171.77777777777777, 113, 379, 119.0, 379.0, 379.0, 379.0, 0.08813678829543452, 0.023583476555614314, 0.05026551207474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 160.6875, 111, 363, 118.0, 349.7, 363.0, 363.0, 0.07726743708740395, 0.03518158451367392, 0.04325542803745539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 145.11111111111111, 118, 347, 119.0, 347.0, 347.0, 347.0, 0.08793871648557805, 0.06535289379445791, 0.04414111354842492], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 701.0, 122, 2716, 468.0, 2276.2000000000016, 2716.0, 2716.0, 0.06703835711332835, 0.012596969936090099, 0.04562514490061563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 123.66666666666667, 118, 131, 122.0, 131.0, 131.0, 131.0, 0.09661524588580078, 0.07604676580464396, 0.034343700685968245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1554.3684210526314, 908, 2827, 1419.0, 2674.0, 2827.0, 2827.0, 0.08187749403156162, 0.042377999840554355, 0.03766044891490774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 385.44444444444446, 234, 689, 252.0, 689.0, 689.0, 689.0, 0.08764071203209597, 0.13582598632318, 0.19710601543937212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1853e96-f1ec-4e50-937b-0f923f728486", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91084514-730a-4e28-81c7-fad34f16939b", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 1226.934426229508, 613, 3063, 996.0, 2102.6, 2440.9999999999995, 3063.0, 0.2960001164590622, 88.14212842887021, 1.078530521675943], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 204.23076923076917, 114, 570, 125.0, 479.8, 510.75, 570.0, 0.24187284000576773, 0.17975120238709888, 0.11692095293247562], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 785.3269230769232, 569, 1062, 752.0, 1010.7, 1029.7499999999998, 1062.0, 0.24140348270947556, 70.98063926659765, 0.12140897812048819], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 190.82692307692304, 112, 502, 122.5, 359.7, 375.19999999999993, 502.0, 0.24205974220637455, 0.4283322782011237, 0.11772046056520949], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1128.576923076923, 774, 1944, 1109.5, 1491.2, 1599.7499999999989, 1944.0, 0.2413317801467483, 217.15075999206388, 0.12113724120647326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 125.125, 114, 157, 121.0, 140.20000000000002, 157.0, 157.0, 0.0927767501464133, 0.06931075572461541, 0.03297923540360786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 202.3563218390805, 113, 2575, 127.5, 301.0, 454.25, 1427.5, 0.7619514715735174, 1.4959181953135605, 0.3713367349284685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 160.9, 117, 448, 126.5, 418.9000000000001, 448.0, 448.0, 0.05484771531841841, 0.04247484203857988, 0.019496648804594043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e4002fd-44b2-4f8a-be64-bce127e9277c", 3, 0, 0.0, 443.6666666666667, 361, 501, 469.0, 501.0, 501.0, 501.0, 0.01843114125626659, 0.025408816152437827, 0.01181944930821783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 140.55555555555554, 115, 383, 122.5, 172.40000000000032, 383.0, 383.0, 0.10495076060148446, 0.08517000201155625, 0.03730671568255894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02158e8f-ba4f-4a84-a4c2-3634fe8be9b2", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 462.6, 231, 1510, 243.0, 1434.2000000000003, 1510.0, 1510.0, 0.05656268559631211, 6.845758638182641, 0.12576359625555023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb7f0487-b316-4da4-b251-e0cb0905db43", 3, 0, 0.0, 303.0, 202, 467, 240.0, 467.0, 467.0, 467.0, 0.016529472048662765, 0.022787211629585552, 0.010599954406206267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 437.0625, 228, 1389, 245.0, 1337.2, 1389.0, 1389.0, 0.07689867638153278, 11.603974595200562, 0.17048751958513164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b6a8332-b282-4a0d-80e9-19343024be60", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.7531507959905661, 1.4072634139150944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/967d50c1-0bcd-4eba-af9a-e841931c5ab4", 3, 0, 0.0, 669.3333333333333, 324, 1250, 434.0, 1250.0, 1250.0, 1250.0, 0.019060810338583527, 0.02627686581507202, 0.012223241004885923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0bcb215-f3c2-480e-9c1f-32fe599868ca", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.5837951325411335, 1.0908220978062155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d42babf1-0d31-4651-869f-6124162ce3f8", 3, 0, 0.0, 315.0, 243, 458, 244.0, 458.0, 458.0, 458.0, 0.02266049294125645, 0.02678393550446034, 0.014531631215584375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8f06306-42ae-4f0e-8ab4-c02ab67cb36b", 3, 0, 0.0, 327.6666666666667, 255, 470, 258.0, 470.0, 470.0, 470.0, 0.03442656813017833, 0.028700013340295153, 0.022076933338688577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 141.00000000000003, 116, 340, 125.5, 240.0, 340.0, 340.0, 0.09322829611970512, 0.0772957259820602, 0.03313974588630143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bf232c6-bd53-4bc5-8de7-1bfffe4c47ce", 1, 0, 0.0, 1009.0, 1009, 1009, 1009.0, 1009.0, 1009.0, 1009.0, 0.9910802775024776, 0.179052589197225, 0.6833033944499505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 123.46153846153847, 117, 135, 123.0, 133.0, 135.0, 135.0, 0.07104562768812062, 0.05515749415239834, 0.025254500467261628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0deb6de6-02ae-400f-a790-61671cf187b6", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21ebcd28-b135-4cd6-9ba7-bf77e262905e", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 0.18102611472945893, 0.6908347945891784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5b953ca-b04c-45ff-9c9d-3c7f665aca6f", 3, 0, 0.0, 408.6666666666667, 273, 507, 446.0, 507.0, 507.0, 507.0, 0.04396957305544563, 0.027352166051092645, 0.028196633762769496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 119.875, 114, 130, 119.0, 128.6, 130.0, 130.0, 0.09194239808759812, 0.06832828607877166, 0.0461507740400639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 249.5625, 114, 378, 339.5, 361.20000000000005, 378.0, 378.0, 0.09182051385055064, 0.03318854266497564, 0.05188441877614733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 246.1875, 113, 1234, 118.5, 632.7000000000006, 1234.0, 1234.0, 0.09182525653681045, 5.187235867877804, 0.05349000539473382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 291.50000000000006, 115, 793, 343.0, 502.5000000000003, 793.0, 793.0, 0.09194556822361162, 1.7129239373103624, 0.05364987989610151], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.47961630695443647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07993605115907274], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07993605115907274], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6394884092725819], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1251, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

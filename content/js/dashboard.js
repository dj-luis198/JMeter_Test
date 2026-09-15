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

    var data = {"OkPercent": 99.08326967150497, "KoPercent": 0.9167303284950343};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7992125984251969, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f23c9667-64bd-4763-8dca-1a8daa80d68f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02d1e122-c821-4568-a474-f5a830077a2b"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/011d6f79-9221-4244-bc80-0faaced260fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db1d4946-1eec-40b8-921a-72f5f906b1c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a091bce9-2bcd-4c80-bdf9-55a36788652e"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=083bfa69-ca41-4498-90e2-f247c86c5bec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fae6283a-cd81-4d1c-addb-62deb560ac83"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=654120ea-c7f7-42f6-a895-c923cd7e5e36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db1d4946-1eec-40b8-921a-72f5f906b1c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96ff2e4-f09b-4fb4-9ed4-2c24f46841b0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e690070-4748-438e-a081-b5b613a62d71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ae38464-f8db-4b8c-a48a-eab229328e7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/714d0ec0-3f8e-4a40-9262-5725bd6c1a26"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52f1129b-d14e-4fa9-b479-da273096cd35"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4aa8d1f5-abc9-4b5e-85da-74f387a95ed7"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=011d6f79-9221-4244-bc80-0faaced260fc"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f23c9667-64bd-4763-8dca-1a8daa80d68f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a091bce9-2bcd-4c80-bdf9-55a36788652e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/769ebf8e-d09e-4cc5-8b50-08f52807b35c"], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/083bfa69-ca41-4498-90e2-f247c86c5bec"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02d1e122-c821-4568-a474-f5a830077a2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52f1129b-d14e-4fa9-b479-da273096cd35"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/654120ea-c7f7-42f6-a895-c923cd7e5e36"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b96ff2e4-f09b-4fb4-9ed4-2c24f46841b0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ae38464-f8db-4b8c-a48a-eab229328e7f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e690070-4748-438e-a081-b5b613a62d71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33a6d388-0fab-48d3-b144-9067128615d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fae6283a-cd81-4d1c-addb-62deb560ac83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=714d0ec0-3f8e-4a40-9262-5725bd6c1a26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4aa8d1f5-abc9-4b5e-85da-74f387a95ed7"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 12, 0.9167303284950343, 344.98395721925164, 81, 3523, 109.0, 957.0, 1178.5, 1828.6000000000004, 5.1879594950756, 762.0279144806591, 3.791411064790044], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f23c9667-64bd-4763-8dca-1a8daa80d68f", 3, 0, 0.0, 477.33333333333337, 181, 843, 408.0, 843.0, 843.0, 843.0, 0.016499744253964062, 0.022746229464693297, 0.010580890683694402], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1433.2333333333331, 1039, 1918, 1439.0, 1742.6, 1794.85, 1918.0, 0.26136843801865295, 314.51554458156, 1.2851465677967948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02d1e122-c821-4568-a474-f5a830077a2b", 1, 0, 0.0, 2843.0, 2843, 2843, 2843.0, 2843.0, 2843.0, 2843.0, 0.35174111853675694, 0.06354697942314456, 0.2425090133661625], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 558.1428571428571, 420, 1028, 462.5, 932.5, 1028.0, 1028.0, 0.08192212716654769, 0.014800384302550118, 0.05568144580851288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 558.1428571428571, 420, 1028, 462.5, 932.5, 1028.0, 1028.0, 0.08253062475682942, 0.014910317949231876, 0.05609503401440749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 147.9545454545455, 84, 272, 88.0, 261.9, 270.79999999999995, 272.0, 0.09663236217809344, 0.045648153333596876, 0.05400397016256199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 103.27272727272727, 83, 258, 86.5, 210.8999999999999, 258.0, 258.0, 0.09662896672888986, 0.07181117546941912, 0.048503211815087294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 183.77272727272725, 84, 738, 87.0, 619.3999999999999, 728.8499999999999, 738.0, 0.09663193773389321, 3.8969934427543613, 0.055770971875713754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 230.5454545454545, 82, 1059, 86.0, 964.4999999999999, 1050.8999999999999, 1059.0, 0.09663236217809344, 11.879307792466628, 0.055676849301831186], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 360.8666666666666, 180, 1767, 198.0, 1302.6000000000004, 1767.0, 1767.0, 0.07569640694388373, 0.14939691253280177, 0.04893654433286233], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/011d6f79-9221-4244-bc80-0faaced260fc", 3, 0, 0.0, 353.0, 193, 668, 198.0, 668.0, 668.0, 668.0, 0.04162330905306972, 0.025892624869927158, 0.02669203087062088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 88.33333333333333, 83, 96, 87.5, 95.1, 96.0, 96.0, 0.09345842917149103, 0.06945494589795378, 0.04691175058022108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 114.72222222222224, 82, 264, 86.5, 260.4, 264.0, 264.0, 0.09346279661456981, 0.0328073076224103, 0.05286692260761203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 655.75, 507, 772, 672.0, 772.0, 772.0, 772.0, 0.05741187277528993, 16.88099684952348, 0.03274270869215754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 873.5, 751, 958, 892.5, 958.0, 958.0, 958.0, 0.057042625101607174, 51.32705433666557, 0.032476416439684554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 215.0, 88, 260, 256.0, 260.0, 260.0, 260.0, 0.057621112375574414, 0.10196235900834066, 0.03190544015327216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 100.2, 86, 253, 88.0, 158.20000000000005, 253.0, 253.0, 0.08166287387985757, 0.0606889131079801, 0.04099093474047539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 108.53333333333332, 84, 255, 86.0, 252.6, 255.0, 255.0, 0.08166242929394664, 0.021851079713419316, 0.04657310420670394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 121.19999999999999, 85, 256, 89.0, 256.0, 256.0, 256.0, 0.0816637630662021, 0.02201093613893728, 0.04800936070884146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db1d4946-1eec-40b8-921a-72f5f906b1c6", 3, 0, 0.0, 440.6666666666667, 250, 637, 435.0, 637.0, 637.0, 637.0, 0.03259275354446194, 0.02717123757401271, 0.02090095198000978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 129.86666666666667, 85, 255, 86.0, 252.6, 255.0, 255.0, 0.08166331847060937, 0.02201081630653143, 0.04808884866970454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 172.5, 86, 263, 170.5, 263.0, 263.0, 263.0, 0.057612813089631135, 0.04281577222774345, 0.03235094485013467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a091bce9-2bcd-4c80-bdf9-55a36788652e", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 152.27777777777777, 82, 918, 87.0, 331.20000000000095, 918.0, 918.0, 0.09346231132295901, 4.69587773604426, 0.054499398985414685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 690.1764705882351, 84, 1280, 928.0, 1260.0, 1280.0, 1280.0, 0.09061543873863309, 47.97236920394337, 0.048691223228468174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 123.22222222222223, 85, 578, 86.0, 282.80000000000047, 578.0, 578.0, 0.09345988494049721, 1.5504747470092837, 0.0545892535410912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 423.7058823529412, 83, 792, 498.0, 778.4, 792.0, 792.0, 0.09061543873863309, 15.682967229193096, 0.04877971486786137], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 640.3571428571429, 170, 2843, 462.0, 1805.0, 2843.0, 2843.0, 0.08239316842929195, 0.014885484530682627, 0.056806227452226674], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 244.86666666666667, 173, 509, 182.0, 411.80000000000007, 509.0, 509.0, 0.08162376884148664, 0.12650089956195243, 0.18357376918158566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=083bfa69-ca41-4498-90e2-f247c86c5bec", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fae6283a-cd81-4d1c-addb-62deb560ac83", 3, 0, 0.0, 377.0, 180, 478, 473.0, 478.0, 478.0, 478.0, 0.017106005918678047, 0.0235820101125005, 0.01096967176425643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 697.7, 92, 1681, 650.5, 1532.8000000000009, 1675.6499999999999, 1681.0, 0.09060145777745564, 0.05565265326369101, 0.04096530756929879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 109.17647058823529, 82, 280, 88.0, 253.59999999999997, 280.0, 280.0, 0.09061109186365696, 0.06733890713695599, 0.04548252072062468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 151.41176470588232, 84, 354, 87.0, 281.19999999999993, 354.0, 354.0, 0.09061447273037397, 0.10430450393906443, 0.04720197832715023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=654120ea-c7f7-42f6-a895-c923cd7e5e36", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db1d4946-1eec-40b8-921a-72f5f906b1c6", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96ff2e4-f09b-4fb4-9ed4-2c24f46841b0", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["login", 20, 0, 0.0, 2744.7500000000005, 1739, 3794, 2629.5, 3682.0, 3788.45, 3794.0, 0.08694782695643478, 20.924588926976867, 0.16002136199423536], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 106.11111111111111, 85, 252, 92.0, 147.60000000000016, 252.0, 252.0, 0.09731044735775105, 0.07877964927692932, 0.03459082308420057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e690070-4748-438e-a081-b5b613a62d71", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ae38464-f8db-4b8c-a48a-eab229328e7f", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/714d0ec0-3f8e-4a40-9262-5725bd6c1a26", 3, 0, 0.0, 393.3333333333333, 203, 500, 477.0, 500.0, 500.0, 500.0, 0.027405018772437856, 0.022846436548246536, 0.017574181960189644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 801.0588235294117, 173, 1372, 1018.0, 1344.8, 1372.0, 1372.0, 0.09056909356320125, 63.79433993943858, 0.19006086609359518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52f1129b-d14e-4fa9-b479-da273096cd35", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 367.3636363636364, 172, 1152, 185.0, 1050.1, 1142.6999999999998, 1152.0, 0.09659205662050736, 15.887150875969214, 0.21386771059263618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1046.5, 838, 1217, 1065.5, 1217.0, 1217.0, 1217.0, 0.056828675749783335, 67.98685304104451, 0.128142004205322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aa8d1f5-abc9-4b5e-85da-74f387a95ed7", 3, 0, 0.0, 679.3333333333334, 222, 993, 823.0, 993.0, 993.0, 993.0, 0.07466587023071754, 0.03378436185569576, 0.047881433709151544], "isController": false}, {"data": ["register", 24, 6, 25.0, 1360.0833333333333, 93, 3523, 1153.5, 2507.5, 3350.75, 3523.0, 0.0992416285551246, 0.03130375588213403, 0.044775031633269104], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 270.49999999999994, 170, 1007, 183.0, 422.0000000000009, 1007.0, 1007.0, 0.09341429238673517, 6.345395899826146, 0.2087631039493487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 93.41666666666667, 87, 120, 91.5, 113.10000000000002, 120.0, 120.0, 0.05774366624160912, 0.04483028775593677, 0.020526068859321994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 365.6470588235294, 172, 1002, 342.0, 935.5999999999999, 1002.0, 1002.0, 0.10028374400509678, 14.251749849943074, 0.22252183936608874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 110.0, 84, 263, 88.5, 263.0, 263.0, 263.0, 0.04053280370469826, 0.030122523065698608, 0.020345567484584867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 106.25, 83, 250, 85.5, 250.0, 250.0, 250.0, 0.04053424130033846, 0.010846076285442126, 0.023117184491599278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 107.99999999999999, 81, 262, 86.5, 262.0, 262.0, 262.0, 0.040535062829347386, 0.010925466153222537, 0.0238301834211593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 107.37499999999999, 82, 252, 88.5, 252.0, 252.0, 252.0, 0.04053526821680289, 0.01092552151156015, 0.02386988938938685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=011d6f79-9221-4244-bc80-0faaced260fc", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 985.3166666666665, 657, 1554, 950.5, 1349.9, 1394.7, 1554.0, 0.2578116943384552, 308.43241627565226, 0.509077388625348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1360.0833333333333, 93, 3523, 1153.5, 2507.5, 3350.75, 3523.0, 0.09868623943748844, 0.031128569666317153, 0.044524455683710606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 86.4, 81, 90, 88.0, 90.0, 90.0, 90.0, 0.027313598348073575, 0.007361868304754205, 0.01608408183973473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f23c9667-64bd-4763-8dca-1a8daa80d68f", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 85.6, 82, 90, 85.0, 90.0, 90.0, 90.0, 0.027313449142357695, 0.007361828089151098, 0.01605732068720638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 101.08333333333333, 83, 251, 87.0, 206.00000000000017, 251.0, 251.0, 0.05555967108674717, 0.014975067597599822, 0.03266300975998222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 132.0, 84, 270, 88.0, 268.8, 270.0, 270.0, 0.055513920115468955, 0.01496273628112249, 0.03269032600549588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 84.4, 82, 85, 85.0, 85.0, 85.0, 85.0, 0.02731270313822959, 0.00730828189440909, 0.015576776008521564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 102.25, 85, 248, 89.5, 203.30000000000015, 248.0, 248.0, 0.0555594138481839, 0.041289759705535105, 0.027888221404264182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 87.4, 83, 91, 88.0, 91.0, 91.0, 91.0, 0.027312106364267025, 0.02029737592110079, 0.013709397139876222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 114.16666666666667, 82, 263, 84.5, 259.40000000000003, 263.0, 263.0, 0.05556018557101981, 0.014866690279745534, 0.03168666833347224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 100.6, 89, 123, 96.0, 123.0, 123.0, 123.0, 0.027207330743195448, 0.021415145096694854, 0.009671355850120257], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 694.9285714285714, 450, 1413, 578.0, 1349.0, 1413.0, 1413.0, 0.08263292095570875, 0.014928799196099726, 0.0562452596739541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1554.0, 945, 2943, 1347.5, 2373.2000000000003, 2915.5999999999995, 2943.0, 0.08918299458659223, 0.046159167120013556, 0.04102069379910638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 176.6, 169, 182, 178.0, 182.0, 182.0, 182.0, 0.02729928202888264, 0.04230855525374683, 0.06139672510987961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a091bce9-2bcd-4c80-bdf9-55a36788652e", 3, 0, 0.0, 307.6666666666667, 193, 526, 204.0, 526.0, 526.0, 526.0, 0.04090704555681307, 0.02629928872874538, 0.026232708250951087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/769ebf8e-d09e-4cc5-8b50-08f52807b35c", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1167.6851851851852, 450, 3860, 799.0, 1997.0, 2570.75, 3860.0, 0.26220592876738935, 93.97158240822793, 0.9506814243487339], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 161.81666666666666, 82, 426, 91.0, 346.8, 367.84999999999997, 426.0, 0.2586507912558789, 0.19221997279855843, 0.1250313883512305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/083bfa69-ca41-4498-90e2-f247c86c5bec", 3, 0, 0.0, 1053.3333333333333, 450, 1767, 943.0, 1767.0, 1767.0, 1767.0, 0.054848617814831066, 0.03526237636207401, 0.03517310452318268], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 547.2833333333334, 410, 760, 509.0, 698.6999999999999, 756.6999999999998, 760.0, 0.25831783426327753, 75.95402023274437, 0.12991570766170696], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 136.5666666666667, 83, 365, 92.0, 260.7, 267.9, 365.0, 0.25881703361170544, 0.4579848290082131, 0.12587000267444268], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 821.7833333333333, 569, 1184, 807.5, 1017.8, 1073.8999999999999, 1184.0, 0.2582633511391566, 232.38581733356003, 0.12963609617727195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.64705882352942, 88, 101, 92.0, 97.8, 101.0, 101.0, 0.09443185353064036, 0.07054723432708972, 0.03356757293471981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, 3.5714285714285716, 215.42857142857125, 84, 2478, 95.0, 378.9, 652.1999999999979, 2472.48, 0.6931493736900302, 1.6048459663760664, 0.3280605652158665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 130.75, 85, 255, 92.0, 255.0, 255.0, 255.0, 0.039888511610049915, 0.030890224323017166, 0.01417911936138493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02d1e122-c821-4568-a474-f5a830077a2b", 3, 0, 0.0, 295.0, 198, 452, 235.0, 452.0, 452.0, 452.0, 0.041938685641592, 0.027454002872799966, 0.026894274320942782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 96.77272727272727, 87, 132, 93.0, 111.1, 128.99999999999994, 132.0, 0.10267132109988986, 0.0833201834316489, 0.03649644617222647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52f1129b-d14e-4fa9-b479-da273096cd35", 3, 0, 0.0, 309.0, 201, 513, 213.0, 513.0, 513.0, 513.0, 0.07266033714396435, 0.03216733675644255, 0.046595333389846935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 241.125, 170, 526, 181.0, 526.0, 526.0, 526.0, 0.040515150133953216, 0.06279056959236695, 0.09111952222509205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 249.91666666666669, 173, 519, 178.5, 472.50000000000017, 519.0, 519.0, 0.055491329479768786, 0.0860007225433526, 0.12480130057803468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/654120ea-c7f7-42f6-a895-c923cd7e5e36", 3, 0, 0.0, 427.0, 189, 630, 462.0, 630.0, 630.0, 630.0, 0.017350668579095913, 0.023919297341299217, 0.011126568066672836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96ff2e4-f09b-4fb4-9ed4-2c24f46841b0", 3, 0, 0.0, 717.0, 210, 1413, 528.0, 1413.0, 1413.0, 1413.0, 0.043099732781656755, 0.027708975339769563, 0.02763882603511192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ae38464-f8db-4b8c-a48a-eab229328e7f", 3, 0, 0.0, 579.3333333333333, 188, 1285, 265.0, 1285.0, 1285.0, 1285.0, 0.04694909153507879, 0.029755820709244277, 0.030107327579461336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e690070-4748-438e-a081-b5b613a62d71", 3, 0, 0.0, 331.3333333333333, 185, 511, 298.0, 511.0, 511.0, 511.0, 0.035704509479547265, 0.022954559317091748, 0.02289644650869405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 104.53333333333333, 87, 271, 92.0, 167.80000000000007, 271.0, 271.0, 0.08388323453752378, 0.06954772082261493, 0.0298178685270104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 95.11764705882354, 84, 122, 93.0, 109.99999999999999, 122.0, 122.0, 0.09326771675143056, 0.07240999493885479, 0.03315375868898508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33a6d388-0fab-48d3-b144-9067128615d9", 2, 0, 0.0, 197.0, 188, 206, 197.0, 206.0, 206.0, 206.0, 0.01639572727347253, 0.0277318355836469, 0.01019128946246608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fae6283a-cd81-4d1c-addb-62deb560ac83", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=714d0ec0-3f8e-4a40-9262-5725bd6c1a26", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 98.52941176470587, 85, 246, 87.0, 140.39999999999992, 246.0, 246.0, 0.10043957082762206, 0.0746430794920121, 0.05041595645058373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 127.23529411764706, 83, 267, 87.0, 265.4, 267.0, 267.0, 0.10043957082762206, 0.04462314112941343, 0.05628954808101338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4aa8d1f5-abc9-4b5e-85da-74f387a95ed7", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 227.70588235294122, 83, 912, 86.0, 848.8, 912.0, 912.0, 0.1003352377354927, 10.645252870620663, 0.05797172685797252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 209.94117647058823, 83, 675, 89.0, 656.6, 675.0, 675.0, 0.10033938320790911, 3.494817028183562, 0.0580721097093109], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 50.0, 0.45836516424751717], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.45836516424751717], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 12, "406/Not Acceptable", 6, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

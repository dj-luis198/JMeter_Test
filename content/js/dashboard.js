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

    var data = {"OkPercent": 97.73071104387292, "KoPercent": 2.26928895612708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7268308489954634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95cab0ab-cbf6-42f7-8002-791736c8bb47"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ed9331e-fe81-472c-9a95-9af134d345ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0325c25f-bafc-41f0-8128-bfd34e1d8c2b"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd963788-c5f5-4fa3-9d37-cde512051939"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04c7f5d5-bd68-4a80-a872-238d2a825249"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78a9ebd1-fddf-4cca-b78e-4feede604ada"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efc5103a-ac5f-40ee-ba93-1be6af5c9068"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=affe6b51-4abd-4b4e-b30c-de840717c085"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb38789b-d105-4d5e-a365-57eafd3df4ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef591f87-4233-4006-b370-f686b716cea3"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ed9331e-fe81-472c-9a95-9af134d345ab"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3297d52-b00c-4c8f-b508-1e70bc24035a"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95cab0ab-cbf6-42f7-8002-791736c8bb47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f0255fe4-d30c-4e0d-a373-85b1b3a139aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04c7f5d5-bd68-4a80-a872-238d2a825249"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f7829b8-8d68-41d9-837f-a697eee60707"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd963788-c5f5-4fa3-9d37-cde512051939"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b2edc4d-79ba-443e-834a-ac5b3ba14a74"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.940677966101695, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0325c25f-bafc-41f0-8128-bfd34e1d8c2b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/efc5103a-ac5f-40ee-ba93-1be6af5c9068"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/701cca16-e482-42f1-94ba-6931501fd733"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78a9ebd1-fddf-4cca-b78e-4feede604ada"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b2edc4d-79ba-443e-834a-ac5b3ba14a74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/affe6b51-4abd-4b4e-b30c-de840717c085"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef591f87-4233-4006-b370-f686b716cea3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3297d52-b00c-4c8f-b508-1e70bc24035a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb38789b-d105-4d5e-a365-57eafd3df4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 30, 2.26928895612708, 489.31543116490184, 139, 2966, 163.0, 1351.1000000000001, 1630.9499999999994, 2256.7899999999995, 5.220797889565513, 721.5302208102307, 3.8150682230824824], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2494.9122807017543, 1789, 4917, 2410.0, 3050.8, 3162.2999999999993, 4917.0, 0.26026565360924536, 313.1877678638696, 1.2797241854712407], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 516.7333333333332, 151, 991, 521.0, 884.8000000000001, 991.0, 991.0, 0.08055594341750535, 0.016394393172078237, 0.05398192223934782], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 516.7333333333332, 151, 991, 521.0, 884.8000000000001, 991.0, 991.0, 0.08026197508668292, 0.016334566023500707, 0.053784929008283036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 187.13333333333333, 143, 469, 148.0, 440.8, 469.0, 469.0, 0.07529931477623554, 0.027688185537511605, 0.042522542732361134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 148.86666666666667, 143, 161, 149.0, 159.2, 161.0, 161.0, 0.07529213347789424, 0.05595440778972413, 0.03779312168714613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 260.1333333333333, 141, 1166, 146.0, 806.0000000000002, 1166.0, 1166.0, 0.07529855878558485, 1.4949607223892736, 0.04390945254182835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 240.6, 141, 1253, 146.0, 770.0000000000002, 1253.0, 1253.0, 0.07530007078206653, 4.535951744263389, 0.04383679901909108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95cab0ab-cbf6-42f7-8002-791736c8bb47", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 268.13333333333344, 145, 406, 260.0, 394.0, 406.0, 406.0, 0.0806269552036637, 0.16072374618365745, 0.052108319290805304], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 165.8421052631579, 142, 425, 150.0, 169.0, 425.0, 425.0, 0.09559556034092395, 0.07104318497992494, 0.047984490249252845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 162.9473684210527, 142, 443, 147.0, 159.0, 443.0, 443.0, 0.09560854841063368, 0.033140627594639885, 0.05410413846633824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1190.75, 1117, 1324, 1161.0, 1324.0, 1324.0, 1324.0, 0.05519753818979674, 16.229908958560447, 0.03147984599886845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1553.5, 1327, 1905, 1491.0, 1905.0, 1905.0, 1905.0, 0.05505849965588438, 49.541734772883686, 0.03134678251892636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 367.75, 142, 469, 430.0, 469.0, 469.0, 469.0, 0.05572349999303456, 0.09860447459704944, 0.030854711421924412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 184.52941176470588, 143, 474, 148.0, 433.99999999999994, 474.0, 474.0, 0.08198776935393638, 0.060930363748384356, 0.04115401703898759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 221.11764705882356, 139, 469, 151.0, 468.2, 469.0, 469.0, 0.08187050013243757, 0.029140028654675045, 0.046287308266512554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 272.82352941176475, 141, 1470, 146.0, 638.7999999999993, 1470.0, 1470.0, 0.08146795673572274, 4.3327259552716955, 0.047482415500956054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 322.8235294117647, 141, 1243, 157.0, 698.9999999999995, 1243.0, 1243.0, 0.08155667709312814, 1.431299068934582, 0.047613770065341295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ed9331e-fe81-472c-9a95-9af134d345ab", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 148.25, 144, 151, 149.0, 151.0, 151.0, 151.0, 0.055973021003876126, 0.04159713767963842, 0.03143016316135623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1106.6, 143, 1913, 1408.0, 1901.6, 1913.0, 1913.0, 0.07937641885348701, 47.62249228395061, 0.042117045159890565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 226.26315789473682, 143, 1616, 148.0, 160.0, 1616.0, 1616.0, 0.09560518079442873, 4.552081276039832, 0.05577296474181569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 854.1999999999999, 142, 1397, 1133.0, 1330.4, 1397.0, 1397.0, 0.07937179867078695, 15.56576052734623, 0.042192105217902044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 246.05263157894737, 143, 1127, 147.0, 450.0, 1127.0, 1127.0, 0.0956071051174961, 1.5039740634277663, 0.055867453643133905], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 484.06666666666666, 148, 736, 511.0, 727.6, 736.0, 736.0, 0.08030236517232887, 0.016342786037024742, 0.05421978054701971], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 544.1176470588235, 292, 1619, 322.0, 1055.7999999999995, 1619.0, 1619.0, 0.08141021650328754, 5.847861215933416, 0.1818682163141285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 697.8947368421053, 161, 1332, 713.0, 1262.0, 1332.0, 1332.0, 0.09639287707371519, 0.05921007781188169, 0.04358388875500989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 187.73333333333332, 142, 451, 149.0, 434.2, 451.0, 451.0, 0.07937725894449413, 0.05899032622730472, 0.03984366318112303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 331.6, 143, 584, 423.0, 515.6, 584.0, 584.0, 0.0793751587503175, 0.10071756797159427, 0.04082446315934299], "isController": false}, {"data": ["login", 19, 0, 0.0, 2904.1052631578946, 1711, 4516, 2667.0, 4514.0, 4516.0, 4516.0, 0.09346346070599347, 23.66930437052359, 0.17364431096523159], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0325c25f-bafc-41f0-8128-bfd34e1d8c2b", 3, 0, 0.0, 428.0, 330, 548, 406.0, 548.0, 548.0, 548.0, 0.08008756240155904, 0.03623753637310125, 0.05135823500360394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 320.63157894736844, 149, 2966, 160.0, 426.0, 2966.0, 2966.0, 0.10265220891345338, 0.08310418084887973, 0.03648965238720413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd963788-c5f5-4fa3-9d37-cde512051939", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04c7f5d5-bd68-4a80-a872-238d2a825249", 3, 0, 0.0, 568.3333333333334, 280, 735, 690.0, 735.0, 735.0, 735.0, 0.04724260653207773, 0.03037244397814242, 0.030295551714906617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78a9ebd1-fddf-4cca-b78e-4feede604ada", 3, 0, 0.0, 358.0, 240, 520, 314.0, 520.0, 520.0, 520.0, 0.018044787161735427, 0.024876195843082535, 0.01157168968379518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1317.6, 295, 2057, 1554.0, 2052.2, 2057.0, 2057.0, 0.07931136584746838, 63.29695013925755, 0.1648447496536737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efc5103a-ac5f-40ee-ba93-1be6af5c9068", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 457.93333333333345, 292, 1400, 302.0, 990.8000000000002, 1400.0, 1400.0, 0.07523737391470088, 6.109500082134133, 0.1679272714790163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 771.3, 145, 2054, 158.0, 2027.7, 2054.0, 2054.0, 0.08791286077240239, 42.08385211078779, 0.11424379280257409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=affe6b51-4abd-4b4e-b30c-de840717c085", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb38789b-d105-4d5e-a365-57eafd3df4ee", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef591f87-4233-4006-b370-f686b716cea3", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["register", 25, 8, 32.0, 1287.3199999999995, 275, 2511, 1200.0, 2057.400000000001, 2464.2, 2511.0, 0.0964837463480902, 0.030196397489878856, 0.04353075274689226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 153.76470588235293, 144, 166, 152.0, 162.0, 166.0, 166.0, 0.08218237719777431, 0.06380370104710018, 0.029213266894521337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 441.89473684210526, 288, 2042, 307.0, 601.0, 2042.0, 2042.0, 0.09552346860797169, 6.154949828183446, 0.21354817367926235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ed9331e-fe81-472c-9a95-9af134d345ab", 3, 0, 0.0, 361.0, 265, 540, 278.0, 540.0, 540.0, 540.0, 0.029865604778496764, 0.02427552575908412, 0.01915209681433549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 507.80000000000007, 290, 936, 582.0, 799.2, 936.0, 936.0, 0.09215287547689113, 0.14281895838068967, 0.20725397678054716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 170.0, 143, 432, 148.5, 296.0, 432.0, 432.0, 0.06732517095784483, 0.050033647557538974, 0.033794079953449456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 167.28571428571428, 142, 444, 143.5, 302.0, 444.0, 444.0, 0.06732646603379788, 0.02523803211953333, 0.03799324150484269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 275.21428571428567, 141, 1675, 146.5, 1049.5, 1675.0, 1675.0, 0.06732678981057127, 4.34404789850246, 0.0391675102553128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3297d52-b00c-4c8f-b508-1e70bc24035a", 3, 0, 0.0, 418.6666666666667, 243, 627, 386.0, 627.0, 627.0, 627.0, 0.022573872999390506, 0.026681553665620746, 0.014476083922135188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 251.5, 143, 1285, 148.0, 876.5, 1285.0, 1285.0, 0.06732387593171436, 1.4308108169031017, 0.03923156107237317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 153.0, 148, 159, 152.0, 159.0, 159.0, 159.0, 0.2724548179093634, 0.08035288575061303, 0.16842177708654982], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1678.245614035087, 1145, 2622, 1625.0, 2360.0, 2479.8, 2622.0, 0.2539722145485978, 303.83906362783716, 0.5014959158371727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1287.3199999999995, 275, 2511, 1200.0, 2057.400000000001, 2464.2, 2511.0, 0.099409902816879, 0.0311121930222201, 0.04485095224745908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 211.0, 146, 447, 156.0, 447.0, 447.0, 447.0, 0.02461368816426191, 0.006634158138023718, 0.014494193323290949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 270.8, 141, 469, 160.0, 469.0, 469.0, 469.0, 0.024574613441330568, 0.00662362627910863, 0.01444718485515723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 278.47058823529414, 141, 1265, 147.0, 604.9999999999994, 1265.0, 1265.0, 0.0851660738439958, 4.52940362613346, 0.04963780935323881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 277.1764705882353, 142, 1170, 149.0, 613.1999999999995, 1170.0, 1170.0, 0.08505188164780517, 1.4926390254305126, 0.04965431256816658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 151.58823529411765, 141, 164, 151.0, 162.4, 164.0, 164.0, 0.08516564718377244, 0.06329204834653401, 0.04274916274654202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 212.4, 147, 469, 149.0, 469.0, 469.0, 469.0, 0.024574613441330568, 0.006575628987231031, 0.01401520922825884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95cab0ab-cbf6-42f7-8002-791736c8bb47", 3, 0, 0.0, 492.33333333333337, 291, 826, 360.0, 826.0, 826.0, 826.0, 0.018401521192418575, 0.022073439320983868, 0.011800454670919462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 164.7058823529412, 142, 445, 147.0, 216.1999999999998, 445.0, 445.0, 0.08517034068136273, 0.030314535320641284, 0.048152946518036074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 268.6, 150, 443, 159.0, 443.0, 443.0, 443.0, 0.024613203506889236, 0.01829164830931905, 0.01235467441654401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0255fe4-d30c-4e0d-a373-85b1b3a139aa", 1, 0, 0.0, 1361.0, 1361, 1361, 1361.0, 1361.0, 1361.0, 1361.0, 0.7347538574577516, 0.23463331190301248, 0.4384127020573108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 161.2, 153, 169, 161.0, 169.0, 169.0, 169.0, 0.02419749023631269, 0.019046071416472684, 0.008601451607439276], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 713.2666666666667, 145, 2347, 615.0, 1795.0000000000005, 2347.0, 2347.0, 0.07966900185363211, 0.015778196851481047, 0.054212266105088724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04c7f5d5-bd68-4a80-a872-238d2a825249", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f7829b8-8d68-41d9-837f-a697eee60707", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1497.7894736842104, 935, 2284, 1428.0, 2128.0, 2284.0, 2284.0, 0.09619181660777026, 0.0497867800801936, 0.044244478146738084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 547.2, 308, 911, 316.0, 911.0, 911.0, 911.0, 0.024556388835683382, 0.03805760652561477, 0.05522789403181526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd963788-c5f5-4fa3-9d37-cde512051939", 3, 0, 0.0, 482.66666666666663, 251, 937, 260.0, 937.0, 937.0, 937.0, 0.05398304932251273, 0.03470589922264409, 0.0346180361866374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b2edc4d-79ba-443e-834a-ac5b3ba14a74", 3, 0, 0.0, 664.0, 250, 1427, 315.0, 1427.0, 1427.0, 1427.0, 0.022098796352225347, 0.026120029151995523, 0.014171428650352844], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1375.2666666666667, 758, 2737, 1167.5, 2462.7999999999997, 2606.6999999999994, 2737.0, 0.2975378740918896, 90.12985901043862, 1.0822698033150677], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 270.9298245614035, 142, 830, 159.0, 597.2, 605.1999999999998, 830.0, 0.2558325329216075, 0.19012554448568686, 0.1236690466759724], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 999.6491228070176, 700, 1825, 931.0, 1289.0, 1329.8999999999996, 1825.0, 0.2555102809268299, 75.1285063322844, 0.1285037057395678], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 208.5964912280702, 141, 588, 149.0, 443.6, 469.1, 588.0, 0.2566677323630993, 0.4541815732831405, 0.12482473702814789], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1403.157894736842, 988, 2274, 1394.0, 1743.8000000000004, 1934.9999999999984, 2274.0, 0.2549559865454806, 229.4098448584435, 0.12797595418396193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 158.93333333333334, 148, 178, 155.0, 177.4, 178.0, 178.0, 0.08828099251377185, 0.06595210866507369, 0.03138113405762983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 210.63841807909606, 142, 898, 156.0, 364.4000000000002, 423.1, 564.9399999999995, 0.757945582076514, 1.6180738105714139, 0.3642988026493838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 195.42857142857144, 146, 425, 160.0, 424.5, 425.0, 425.0, 0.0694761498302797, 0.05380330743692558, 0.024696600134982233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 157.86666666666665, 144, 178, 153.0, 175.0, 178.0, 178.0, 0.07748093968883654, 0.06287759851701481, 0.027542052780016115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0325c25f-bafc-41f0-8128-bfd34e1d8c2b", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efc5103a-ac5f-40ee-ba93-1be6af5c9068", 3, 0, 0.0, 375.6666666666667, 241, 615, 271.0, 615.0, 615.0, 615.0, 0.02830589234325612, 0.028388819762230504, 0.018151890597726095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/701cca16-e482-42f1-94ba-6931501fd733", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 475.14285714285717, 292, 1820, 305.0, 1360.5, 1820.0, 1820.0, 0.06727631825542896, 5.845808047148685, 0.1500764967779449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78a9ebd1-fddf-4cca-b78e-4feede604ada", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 470.52941176470586, 291, 1411, 315.0, 777.3999999999994, 1411.0, 1411.0, 0.08498427790858691, 6.104593306488299, 0.18985257258657148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b2edc4d-79ba-443e-834a-ac5b3ba14a74", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 187.64705882352942, 147, 433, 156.0, 431.4, 433.0, 433.0, 0.08463564355449789, 0.07017154431422726, 0.03008532641976292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 154.0, 147, 165, 153.0, 165.0, 165.0, 165.0, 0.07772906756210553, 0.06034629757018935, 0.0276302544849672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/affe6b51-4abd-4b4e-b30c-de840717c085", 3, 0, 0.0, 964.0, 258, 2347, 287.0, 2347.0, 2347.0, 2347.0, 0.01589563982599573, 0.0219134227418919, 0.010193492987373563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef591f87-4233-4006-b370-f686b716cea3", 3, 0, 0.0, 505.3333333333333, 316, 666, 534.0, 666.0, 666.0, 666.0, 0.053884149079479124, 0.03464231589582398, 0.03455461383026493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3297d52-b00c-4c8f-b508-1e70bc24035a", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb38789b-d105-4d5e-a365-57eafd3df4ee", 3, 0, 0.0, 577.0, 293, 976, 462.0, 976.0, 976.0, 976.0, 0.022568099239455054, 0.026674729276842873, 0.014472381348218247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 168.33333333333334, 141, 467, 149.0, 278.60000000000014, 467.0, 467.0, 0.09223674096848578, 0.06854703112990007, 0.046298520368946966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 166.66666666666669, 140, 469, 144.0, 282.4000000000001, 469.0, 469.0, 0.09223900972199163, 0.024681141273267287, 0.05260506023207335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 291.5333333333333, 142, 567, 157.0, 507.6, 567.0, 567.0, 0.09223844252315185, 0.02486114271131827, 0.05422611562396231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 306.2666666666667, 143, 477, 427.0, 459.6, 477.0, 477.0, 0.09223844252315185, 0.02486114271131827, 0.05431619222798883], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6051437216338881], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22692889561270801], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22692889561270801], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.2102874432677762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 95.33678756476684, "KoPercent": 4.66321243523316};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7249047013977128, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ada7c982-c406-4f57-a4d3-50d842f3c02d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.3, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/003d27f1-25e7-43a1-80ff-13e8b0c53daf"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e8df2a4-1013-49ae-9061-81f4e0e6489a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29ff585c-0e2a-49cc-8ff4-8b6be9206e3f"], "isController": false}, {"data": [0.8983050847457628, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76cce477-8d70-4157-a333-7284a1770838"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ada7c982-c406-4f57-a4d3-50d842f3c02d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9e580f-59e8-4471-b3f1-195b3980fc9f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8431952662721893, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29ff585c-0e2a-49cc-8ff4-8b6be9206e3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e8df2a4-1013-49ae-9061-81f4e0e6489a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/569f3c2d-ec27-474c-8222-ca77ef25c55d"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9e580f-59e8-4471-b3f1-195b3980fc9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/510f9453-1ec3-4566-9328-33320830a971"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54f7fa09-be6a-46ba-bfa9-2c3e3deec613"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54f7fa09-be6a-46ba-bfa9-2c3e3deec613"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26fe297d-5634-4bd2-ae93-596d24c627f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=569f3c2d-ec27-474c-8222-ca77ef25c55d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510f9453-1ec3-4566-9328-33320830a971"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29ac211f-e57a-4b56-9da3-e68160cb6c1d"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29ac211f-e57a-4b56-9da3-e68160cb6c1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26fe297d-5634-4bd2-ae93-596d24c627f5"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 63, 4.66321243523316, 412.45151739452297, 138, 2154, 150.0, 1106.6, 1274.3999999999978, 1679.96, 5.280375840814843, 760.9003097603897, 3.8852952794182594], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2036.5593220338985, 1688, 2563, 2038.0, 2317.0, 2473.0, 2563.0, 0.25333739818198214, 304.8497523385404, 1.2456580076623829], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 447.76190476190476, 286, 1164, 293.0, 695.8000000000001, 1119.8999999999994, 1164.0, 0.09652731493185632, 5.641533175518834, 0.2159161260945508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 172.0, 145, 433, 149.0, 348.1000000000003, 433.0, 433.0, 0.0922346141134332, 0.07160792794939394, 0.032786522985634454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 374.13636363636357, 287, 854, 293.0, 654.4999999999999, 828.7999999999996, 854.0, 0.096681198143721, 0.1498369740762551, 0.21743828059081002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 176.55555555555554, 140, 439, 146.0, 439.0, 439.0, 439.0, 0.0482902566358861, 0.0358875833006927, 0.024239445225435016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 143.00000000000003, 139, 147, 143.0, 147.0, 147.0, 147.0, 0.0482902566358861, 0.012921416326399211, 0.027540536987653793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ada7c982-c406-4f57-a4d3-50d842f3c02d", 3, 0, 0.0, 613.6666666666667, 237, 1268, 336.0, 1268.0, 1268.0, 1268.0, 0.03114941335271519, 0.025967984243588413, 0.01997537249506801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 176.22222222222223, 140, 435, 145.0, 435.0, 435.0, 435.0, 0.0482889611434826, 0.013015384058204295, 0.028388627547242702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 173.77777777777777, 140, 422, 144.0, 422.0, 422.0, 422.0, 0.0482902566358861, 0.013015733233891175, 0.02843654760882746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 195.66666666666669, 142, 439, 148.5, 439.0, 439.0, 439.0, 0.06570949830798041, 0.01937916844629891, 0.04061925041889805], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1344.2711864406776, 1110, 1978, 1164.0, 1707.0, 1882.0, 1978.0, 0.2527849185946872, 302.4186448961011, 0.49915147011568123], "isController": false}, {"data": ["deleteBook", 15, 6, 40.0, 567.6666666666666, 146, 1404, 516.0, 1311.6000000000001, 1404.0, 1404.0, 0.09465633440189818, 0.021427088197617187, 0.06252494588812883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 6, 40.0, 567.6666666666666, 146, 1404, 516.0, 1311.6000000000001, 1404.0, 1404.0, 0.09621984309750918, 0.021781015263674444, 0.06355771667105002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 14, 56.0, 752.7999999999998, 173, 2058, 674.0, 1394.8, 1861.1999999999996, 2058.0, 0.10153768672780589, 0.030921398661327138, 0.0458109485041468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 143.33333333333334, 140, 146, 144.0, 146.0, 146.0, 146.0, 0.01881255173451727, 0.005070570584694108, 0.011078094429603433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 177.11764705882354, 138, 437, 145.0, 424.2, 437.0, 437.0, 0.10861370577186011, 0.029062651739736003, 0.06194375407301397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 143.66666666666666, 141, 145, 145.0, 145.0, 145.0, 145.0, 0.018812905653278148, 0.005070665976860126, 0.011059930862571723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 148.4705882352941, 139, 194, 147.0, 166.79999999999998, 194.0, 194.0, 0.10861578762418937, 0.0807193499824298, 0.054520034022298186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 177.76470588235293, 139, 436, 145.0, 424.0, 436.0, 436.0, 0.10861162399933555, 0.029274226781070913, 0.06395782155429623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 175.1176470588235, 139, 421, 143.0, 418.6, 421.0, 421.0, 0.10861648159270097, 0.029275536054282684, 0.06385461124883397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 164.91666666666666, 138, 423, 141.0, 340.2000000000003, 423.0, 423.0, 0.09279020135473695, 0.02500985895889394, 0.05455048946831214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 180.75000000000003, 140, 590, 144.5, 457.1000000000005, 590.0, 590.0, 0.09279450656521133, 0.025011019347654616, 0.05464364009650628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 143.0, 141, 145, 143.0, 145.0, 145.0, 145.0, 0.01881243376455612, 0.005033795753406618, 0.010728966131348413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 145.33333333333337, 140, 148, 146.0, 148.0, 148.0, 148.0, 0.09279307145066502, 0.06896047595112899, 0.04657777219300959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 146.66666666666666, 146, 148, 146.0, 148.0, 148.0, 148.0, 0.01881219782907237, 0.013980549363207103, 0.009442841488421092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 143.75, 139, 147, 144.5, 146.4, 147.0, 147.0, 0.09278948385849603, 0.024828436110574136, 0.05291900251304853], "isController": false}, {"data": ["deleteAccount", 15, 6, 40.0, 510.40000000000003, 140, 1268, 512.0, 1039.4, 1268.0, 1268.0, 0.09577687818458121, 0.020633182937029895, 0.06515446615564381], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 147.33333333333334, 146, 148, 148.0, 148.0, 148.0, 148.0, 0.01966568338249754, 0.015479043756145524, 0.0069905358898721725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/003d27f1-25e7-43a1-80ff-13e8b0c53daf", 2, 0, 0.0, 252.0, 244, 260, 252.0, 260.0, 260.0, 260.0, 0.03350195986465208, 0.03875299947234413, 0.020824216263526416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1216.1304347826087, 881, 2154, 1055.0, 1789.4, 2082.199999999999, 2154.0, 0.10211194132559058, 0.05285090713140919, 0.04696750426206364], "isController": false}, {"data": ["goToProfile", 16, 6, 37.5, 221.875, 144, 336, 250.5, 306.6, 336.0, 336.0, 0.08592218671965202, 0.11491777817307951, 0.05551588553553688], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 292.6666666666667, 291, 295, 292.0, 295.0, 295.0, 295.0, 0.018795108259823577, 0.029128746883144544, 0.04227063898669306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 145.04761904761904, 139, 150, 146.0, 148.0, 149.8, 150.0, 0.09659258168972623, 0.07178413541590006, 0.04848494823097586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 860.9166666666667, 692, 1015, 904.5, 1012.9, 1015.0, 1015.0, 0.0571148436719133, 16.793660430836304, 0.032573309281638055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 183.95238095238093, 139, 435, 142.0, 433.4, 434.9, 435.0, 0.09659435888944086, 0.0327551183510883, 0.05470266473937922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 1185.3333333333333, 965, 1407, 1244.5, 1378.8000000000002, 1407.0, 1407.0, 0.05711647477117712, 51.39350439915848, 0.03251846171054323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 333.83333333333337, 140, 439, 419.5, 438.4, 439.0, 439.0, 0.057274862063040534, 0.10134965825998969, 0.03171371756810936], "isController": false}, {"data": ["addBook", 55, 25, 45.45454545454545, 1149.6363636363635, 723, 3157, 1026.0, 1997.1999999999998, 2117.4, 3157.0, 0.25227969102618203, 55.92247896618076, 0.9188812929448837], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 145.58333333333331, 141, 149, 146.0, 148.7, 149.0, 149.0, 0.05855829478245594, 0.04351842024360251, 0.02939351906072495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 240.0, 141, 440, 145.5, 439.1, 440.0, 440.0, 0.05848095713833183, 0.022967862886522576, 0.032943130315066155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 261.91666666666663, 141, 1258, 144.5, 1014.1000000000008, 1258.0, 1258.0, 0.058559437829396835, 4.405458723221257, 0.034007173531134104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e8df2a4-1013-49ae-9061-81f4e0e6489a", 3, 0, 0.0, 349.3333333333333, 243, 534, 271.0, 534.0, 534.0, 534.0, 0.025277206700144925, 0.025351261016649255, 0.01620966705705908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29ff585c-0e2a-49cc-8ff4-8b6be9206e3f", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 267.03389830508485, 140, 623, 147.0, 579.0, 591.0, 623.0, 0.2538890203756697, 0.18868119580652798, 0.1227295557480044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 312.25, 139, 721, 288.5, 636.1000000000004, 721.0, 721.0, 0.05847554260430575, 1.4472601619528882, 0.03401555814905416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76cce477-8d70-4157-a333-7284a1770838", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ada7c982-c406-4f57-a4d3-50d842f3c02d", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 835.3220338983052, 690, 1175, 722.0, 1105.0, 1123.0, 1175.0, 0.2534658229261985, 74.5273677977042, 0.12747548711620335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 168.16666666666669, 139, 439, 144.0, 351.4000000000003, 439.0, 439.0, 0.0573501369234519, 0.042620560740963764, 0.03220344602635239], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 251.42372881355928, 139, 587, 147.0, 437.0, 478.0, 587.0, 0.2541197550113277, 0.44967284773488847, 0.12358558398011836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 219.04761904761907, 138, 1015, 145.0, 544.4000000000001, 970.7999999999994, 1015.0, 0.09659124883285573, 4.1635077471356094, 0.05638981295794601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 617.8333333333334, 141, 1307, 285.0, 1300.7, 1307.0, 1307.0, 0.09487716043200733, 37.95671163668373, 0.05215361271143112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c9e580f-59e8-4471-b3f1-195b3980fc9f", 3, 0, 0.0, 340.6666666666667, 250, 511, 261.0, 511.0, 511.0, 511.0, 0.022277503434448447, 0.02633125487320388, 0.014286029220658672], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1065.8474576271187, 962, 1413, 1009.0, 1286.0, 1301.0, 1413.0, 0.25347126752818255, 228.07389207682112, 0.12723069483348226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 174.86363636363635, 144, 442, 149.0, 347.3999999999998, 439.59999999999997, 442.0, 0.09784822850229943, 0.07309950664478425, 0.034781987475426754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 250.8095238095238, 138, 974, 145.0, 438.0, 920.3999999999992, 974.0, 0.09659480319958785, 1.3772755119524571, 0.056486218853925664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 522.2777777777777, 139, 1113, 431.5, 1110.3, 1113.0, 1113.0, 0.09487566017646873, 12.412692979728233, 0.052245440038582766], "isController": false}, {"data": ["deleteBooks", 15, 6, 40.0, 372.9333333333333, 142, 764, 439.0, 635.0000000000001, 764.0, 764.0, 0.09648970454852467, 0.021842103041355487, 0.06377366410004053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 25, 14.792899408284024, 192.92899408284026, 141, 1170, 149.0, 315.0, 428.5, 708.0000000000075, 0.6821557737018858, 1.5724436376360276, 0.32119534176407905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 181.33333333333337, 147, 440, 149.0, 440.0, 440.0, 440.0, 0.048370453177401324, 0.037458759150077396, 0.017194184527904378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ff585c-0e2a-49cc-8ff4-8b6be9206e3f", 3, 0, 0.0, 660.0, 264, 1091, 625.0, 1091.0, 1091.0, 1091.0, 0.015703764192276887, 0.021648906690850463, 0.010070447740490061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e8df2a4-1013-49ae-9061-81f4e0e6489a", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 505.83333333333326, 288, 1404, 436.0, 1160.1000000000008, 1404.0, 1404.0, 0.05843311599460468, 5.908540037945005, 0.13017155901988187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 169.29411764705884, 143, 446, 149.0, 247.59999999999982, 446.0, 446.0, 0.11003236245954692, 0.08929384101941748, 0.03911306634304207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 345.60869565217394, 149, 846, 282.0, 713.6000000000001, 829.5999999999998, 846.0, 0.10195939356325914, 0.06262935405399414, 0.04610078048807518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 159.94444444444446, 140, 430, 143.5, 182.5000000000004, 430.0, 430.0, 0.09487716043200733, 0.07050929598511484, 0.047623887169972436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 256.9999999999999, 139, 489, 147.0, 453.90000000000003, 489.0, 489.0, 0.09487816062872595, 0.08872178692473526, 0.05056874186287997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/569f3c2d-ec27-474c-8222-ca77ef25c55d", 3, 0, 0.0, 431.33333333333337, 237, 803, 254.0, 803.0, 803.0, 803.0, 0.08356545961002786, 0.037811194289693595, 0.05358852715877437], "isController": false}, {"data": ["login", 23, 0, 0.0, 2491.086956521739, 1317, 3952, 2652.0, 3556.6, 3880.199999999999, 3952.0, 0.10241248185517984, 64.05552001885725, 0.24312093550462638], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 355.3333333333333, 286, 876, 291.0, 876.0, 876.0, 876.0, 0.04825219815569375, 0.07478148288387304, 0.10852032456304954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9e580f-59e8-4471-b3f1-195b3980fc9f", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 162.09523809523807, 144, 428, 149.0, 158.8, 401.2999999999996, 428.0, 0.09959923166307003, 0.0806325811022315, 0.035404414380231924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 351.75, 287, 737, 293.0, 686.3000000000002, 737.0, 737.0, 0.09268771192659132, 0.14364785041748088, 0.20845683649115215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510f9453-1ec3-4566-9328-33320830a971", 3, 0, 0.0, 524.6666666666666, 251, 811, 512.0, 811.0, 811.0, 811.0, 0.03989308652810468, 0.02611490788021436, 0.025582480618608797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54f7fa09-be6a-46ba-bfa9-2c3e3deec613", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54f7fa09-be6a-46ba-bfa9-2c3e3deec613", 3, 0, 0.0, 471.0, 246, 887, 280.0, 887.0, 887.0, 887.0, 0.051460624045834256, 0.03308422281592535, 0.033000465289809086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26fe297d-5634-4bd2-ae93-596d24c627f5", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=569f3c2d-ec27-474c-8222-ca77ef25c55d", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510f9453-1ec3-4566-9328-33320830a971", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 149.5, 143, 158, 150.0, 156.8, 158.0, 158.0, 0.06052627596955528, 0.05018242997866449, 0.021515199661052854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 808.8333333333333, 285, 1463, 720.5, 1443.2, 1463.0, 1463.0, 0.09480470231323473, 50.49024194620886, 0.20243725442948637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 149.88888888888889, 141, 167, 149.5, 158.9, 167.0, 167.0, 0.09397416754549916, 0.07295846015495296, 0.03340487986968915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29ac211f-e57a-4b56-9da3-e68160cb6c1d", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 24, 12, 50.0, 761.9166666666666, 140, 1683, 772.5, 1503.5, 1649.75, 1683.0, 0.11119141602268305, 66.52667117223551, 0.1621993922694168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 361.82352941176464, 286, 631, 294.0, 591.8, 631.0, 631.0, 0.10851387062593354, 0.16817530535484035, 0.2440502383315673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ac211f-e57a-4b56-9da3-e68160cb6c1d", 3, 0, 0.0, 342.3333333333333, 252, 513, 262.0, 513.0, 513.0, 513.0, 0.06429489927132447, 0.029091767573939137, 0.041230778504072016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 156.63636363636365, 139, 417, 145.0, 148.0, 376.6499999999994, 417.0, 0.09674326974662058, 0.0718961213644319, 0.04856058657203416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26fe297d-5634-4bd2-ae93-596d24c627f5", 3, 0, 0.0, 778.6666666666666, 294, 1198, 844.0, 1198.0, 1198.0, 1198.0, 0.031760819852629796, 0.026477688685737275, 0.020367452835182518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 188.77272727272725, 140, 545, 144.0, 437.0, 528.7999999999997, 545.0, 0.09674709868643826, 0.025887407265707114, 0.05517607971960932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 174.4545454545454, 138, 436, 145.0, 373.2999999999999, 434.2, 436.0, 0.09674497146023342, 0.02607579308889104, 0.05687546173736379], "isController": false}, {"data": ["register", 25, 14, 56.0, 752.7999999999998, 173, 2058, 674.0, 1394.8, 1861.1999999999996, 2058.0, 0.10210916695257234, 0.031095432248525543, 0.0460687843086801], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 200.1818181818182, 140, 435, 145.0, 431.5, 434.7, 435.0, 0.09674497146023342, 0.02607579308889104, 0.05696993924855542], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 14, 22.22222222222222, 1.0362694300518134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 9.523809523809524, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 9.523809523809524, 0.44411547002220575], "isController": false}, {"data": ["401/Unauthorized", 37, 58.73015873015873, 2.7387120651369354], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 63, "401/Unauthorized", 37, "406/Not Acceptable", 14, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 14, "406/Not Acceptable", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 25, "401/Unauthorized", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 24, 12, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

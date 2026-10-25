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

    var data = {"OkPercent": 98.45320959010054, "KoPercent": 1.5467904098994587};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7741184298070526, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017857142857142856, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d5ba8d3-e1dd-4879-8bb3-5383c7478b7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab4a5dd1-4146-406b-b761-ededbafd9f92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c5f38b3-87ae-4697-9bee-00eee423e26b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7df06e0f-9147-48ac-b8be-0ebc8425aee1"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e08253e-681d-48a2-bb11-58ddcb7bcd92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b9fc7b9-cfde-4adf-9ffd-58e7068f764f"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d939bf96-c855-4c77-aee6-d03460af11a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d797dc54-ca3c-42bd-867f-c41633d6a8f8"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/30e97d5b-1c2e-433d-afdd-2e815d962b81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d5ba8d3-e1dd-4879-8bb3-5383c7478b7f"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2023cee0-5892-4939-b4ca-ec70b184ac23"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fee6a4b3-1c18-48d2-bd49-ec45976a66c5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd4fc5b0-7472-4ca2-a94a-a8787e6eca0d"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e08253e-681d-48a2-bb11-58ddcb7bcd92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/38cb10e9-33ab-4e8e-9762-1b47031bfe6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7df06e0f-9147-48ac-b8be-0ebc8425aee1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c5f38b3-87ae-4697-9bee-00eee423e26b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ab4a5dd1-4146-406b-b761-ededbafd9f92"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b9fc7b9-cfde-4adf-9ffd-58e7068f764f"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=556c09eb-ca55-4c8c-8ffd-cbe74341b80c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4cfce89-4895-40ab-9c34-512311ea3172"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bcf5ced-81fa-49a9-b2c5-b7b98ea0af9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bcf5ced-81fa-49a9-b2c5-b7b98ea0af9c"], "isController": false}, {"data": [0.9382352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fee6a4b3-1c18-48d2-bd49-ec45976a66c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/556c09eb-ca55-4c8c-8ffd-cbe74341b80c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d939bf96-c855-4c77-aee6-d03460af11a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd4fc5b0-7472-4ca2-a94a-a8787e6eca0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2023cee0-5892-4939-b4ca-ec70b184ac23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 20, 1.5467904098994587, 398.0239752513535, 111, 2338, 127.0, 1080.0000000000014, 1377.0999999999997, 1841.1799999999998, 5.01234673189566, 708.1985231409155, 3.666204522305524], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2009.9821428571424, 1440, 2840, 1963.5, 2439.6, 2676.6, 2840.0, 0.24432276782792695, 294.0025330422002, 1.2013331406382932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d5ba8d3-e1dd-4879-8bb3-5383c7478b7f", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab4a5dd1-4146-406b-b761-ededbafd9f92", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c5f38b3-87ae-4697-9bee-00eee423e26b", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7df06e0f-9147-48ac-b8be-0ebc8425aee1", 3, 0, 0.0, 583.3333333333334, 232, 1002, 516.0, 1002.0, 1002.0, 1002.0, 0.023053514892570622, 0.027248474145483047, 0.014783666776811238], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 532.3846153846155, 119, 876, 528.0, 776.8, 876.0, 876.0, 0.1044529078082566, 0.019788929799611114, 0.07061085617236337], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 532.3846153846155, 119, 876, 528.0, 776.8, 876.0, 876.0, 0.1067595200748959, 0.02022592470168926, 0.07217014131264936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 169.6428571428571, 114, 364, 121.0, 359.5, 364.0, 364.0, 0.1054463014709759, 0.03952765235107593, 0.05950478368444441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 137.78571428571425, 114, 352, 123.0, 239.0, 352.0, 352.0, 0.10544233057676954, 0.07836095075090002, 0.052927107340292524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 273.2857142857143, 117, 952, 124.0, 709.0, 952.0, 952.0, 0.1054431247316849, 2.2409458954380788, 0.06144474497827119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 238.85714285714283, 112, 1324, 121.0, 845.0, 1324.0, 1324.0, 0.10545106693883086, 6.803896146234266, 0.06134639357351069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e08253e-681d-48a2-bb11-58ddcb7bcd92", 3, 0, 0.0, 313.0, 212, 507, 220.0, 507.0, 507.0, 507.0, 0.08468834688346884, 0.038319271539069555, 0.05430860786472448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b9fc7b9-cfde-4adf-9ffd-58e7068f764f", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 218.69230769230768, 116, 240, 227.0, 238.8, 240.0, 240.0, 0.10502928701272471, 0.21961314633407392, 0.0678919031508786], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 146.44444444444446, 115, 353, 122.5, 338.6, 353.0, 353.0, 0.08845252310822166, 0.06573473641148114, 0.04439902038830658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 146.77777777777777, 116, 359, 122.0, 349.1, 359.0, 359.0, 0.0883565678382093, 0.03101491937463185, 0.04997860114372668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 875.0, 723, 970, 937.0, 970.0, 970.0, 970.0, 0.10944710968424508, 32.18108423323179, 0.06241905474179603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1377.5, 1044, 1682, 1418.5, 1682.0, 1682.0, 1682.0, 0.10842655004788838, 97.56240032663497, 0.061731131521405205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 235.16666666666669, 118, 356, 234.5, 356.0, 356.0, 356.0, 0.11108436857793495, 0.19656726158517396, 0.0615086298668839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 135.46666666666667, 114, 346, 121.0, 214.00000000000009, 346.0, 346.0, 0.08477689547008788, 0.06300314204368836, 0.042554027609008956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 167.8, 114, 364, 121.0, 361.0, 364.0, 364.0, 0.08477929124512519, 0.03117405188492624, 0.04787601381902447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 260.20000000000005, 113, 1531, 121.0, 831.4000000000004, 1531.0, 1531.0, 0.0847802495930548, 5.1070220389791325, 0.04935579374095678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 173.73333333333335, 114, 726, 119.0, 492.60000000000014, 726.0, 726.0, 0.08477929124512519, 1.6831890613519471, 0.04943802810433504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 162.0, 122, 350, 124.5, 350.0, 350.0, 350.0, 0.11108231199318695, 0.08255238225274929, 0.06237532167586181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 805.0999999999999, 116, 1844, 726.0, 1561.4000000000003, 1830.3999999999999, 1844.0, 0.09196417075907226, 41.387154861341024, 0.05011328836285383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 196.1111111111111, 116, 1001, 123.0, 425.0000000000009, 1001.0, 1001.0, 0.08845556582076937, 4.444321098925265, 0.051579883975782836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 518.7, 111, 970, 427.5, 969.6, 970.0, 970.0, 0.09206789086272217, 13.547916014519107, 0.05025971776588056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 189.11111111111114, 116, 927, 121.0, 398.70000000000084, 927.0, 927.0, 0.08836090520838448, 1.465884023243827, 0.05161097577438516], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 518.6923076923076, 123, 1268, 499.0, 1012.3999999999997, 1268.0, 1268.0, 0.1070707902647943, 0.020284895811884855, 0.07323313892435036], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 428.59999999999997, 237, 1656, 246.0, 1089.0000000000005, 1656.0, 1656.0, 0.08471895897343212, 6.879433184275031, 0.1890898483389436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d939bf96-c855-4c77-aee6-d03460af11a2", 3, 0, 0.0, 610.3333333333334, 225, 980, 626.0, 980.0, 980.0, 980.0, 0.025772531635782584, 0.02584803709955929, 0.016527307071123595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d797dc54-ca3c-42bd-867f-c41633d6a8f8", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 464.1363636363637, 173, 1148, 395.0, 1046.6, 1141.25, 1148.0, 0.09408584906063833, 0.05779296783119288, 0.04254076964362846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 145.20000000000002, 114, 365, 123.0, 333.00000000000045, 364.55, 365.0, 0.09206365280955252, 0.0684183982305366, 0.04621163822666992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 236.1, 112, 368, 232.5, 365.9, 367.9, 368.0, 0.09196205645550647, 0.09366838367489574, 0.04858542240471581], "isController": false}, {"data": ["login", 22, 0, 0.0, 2237.4999999999995, 1317, 3342, 2299.5, 3187.8999999999996, 3337.2, 3342.0, 0.09355173410896225, 30.651356938668336, 0.18345740897841506], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 137.44444444444449, 115, 358, 125.0, 165.40000000000032, 358.0, 358.0, 0.08770305693877352, 0.07100179121312818, 0.031175696021204652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30e97d5b-1c2e-433d-afdd-2e815d962b81", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.5209395391517129, 0.9733763254486134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d5ba8d3-e1dd-4879-8bb3-5383c7478b7f", 3, 0, 0.0, 327.6666666666667, 229, 472, 282.0, 472.0, 472.0, 472.0, 0.027857222449207, 0.02793883540560116, 0.01786416934405527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 951.8000000000002, 233, 1971, 971.5, 1687.5000000000002, 1957.35, 1971.0, 0.0919092304440135, 55.04891689280167, 0.19494809426210674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2023cee0-5892-4939-b4ca-ec70b184ac23", 3, 0, 0.0, 314.3333333333333, 227, 466, 250.0, 466.0, 466.0, 466.0, 0.05065941674124858, 0.03256912371873892, 0.03248667024096996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 488.7142857142858, 235, 1447, 470.0, 1083.0, 1447.0, 1447.0, 0.10534632604687912, 9.153806517833628, 0.23500108168102635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1184.75, 116, 1807, 1455.0, 1807.0, 1807.0, 1807.0, 0.14424550585095833, 129.43547887254107, 0.26783671746813076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fee6a4b3-1c18-48d2-bd49-ec45976a66c5", 3, 0, 0.0, 412.0, 237, 508, 491.0, 508.0, 508.0, 508.0, 0.016079669401997097, 0.022167122368964093, 0.010311506745421315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd4fc5b0-7472-4ca2-a94a-a8787e6eca0d", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 798.7391304347825, 202, 1664, 849.0, 1309.2, 1600.799999999999, 1664.0, 0.10063927819759429, 0.03170615846748258, 0.045405611843055235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e08253e-681d-48a2-bb11-58ddcb7bcd92", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 124.88888888888889, 118, 134, 125.0, 127.70000000000002, 134.0, 134.0, 0.09601177744469988, 0.07454039362161759, 0.03412918651354566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 357.22222222222223, 240, 1338, 247.0, 777.3000000000009, 1338.0, 1338.0, 0.08830152025784044, 5.998098259662884, 0.19733703463872412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38cb10e9-33ab-4e8e-9762-1b47031bfe6e", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7df06e0f-9147-48ac-b8be-0ebc8425aee1", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 354.2, 240, 486, 250.0, 486.0, 486.0, 486.0, 0.10320556484405638, 0.1599484681714038, 0.23211173421470885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 121.14285714285714, 119, 124, 120.0, 124.0, 124.0, 124.0, 0.03710575139146567, 0.02757566094619666, 0.018625347866419294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 119.85714285714285, 117, 123, 119.0, 123.0, 123.0, 123.0, 0.03710653817202591, 0.009928897909311622, 0.02116232255123353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c5f38b3-87ae-4697-9bee-00eee423e26b", 3, 0, 0.0, 348.6666666666667, 235, 450, 361.0, 450.0, 450.0, 450.0, 0.019844682286636592, 0.02345574263762287, 0.012725919304906928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 156.14285714285717, 120, 360, 123.0, 360.0, 360.0, 360.0, 0.03710575139146567, 0.010001159554730982, 0.021814123376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 151.28571428571428, 114, 344, 120.0, 344.0, 344.0, 344.0, 0.03706233355041272, 0.009989457089759677, 0.021824792120018425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1388.5178571428573, 912, 2338, 1300.0, 1945.1000000000001, 2183.7999999999997, 2338.0, 0.2548651945167574, 304.9073781198231, 0.5032592024539878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab4a5dd1-4146-406b-b761-ededbafd9f92", 3, 0, 0.0, 738.3333333333334, 231, 1040, 944.0, 1040.0, 1040.0, 1040.0, 0.021895572715196987, 0.02195971990088604, 0.014041106200826192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 798.7391304347825, 202, 1664, 849.0, 1309.2, 1600.799999999999, 1664.0, 0.09799869619125937, 0.030874249564331883, 0.04421425550816585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 118.0, 113, 122, 118.0, 122.0, 122.0, 122.0, 0.031487963725865785, 0.008486990222987262, 0.018542228639352606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 118.5, 116, 123, 117.5, 123.0, 123.0, 123.0, 0.03148779847808974, 0.008486945683547624, 0.018511381527158224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 240.11111111111111, 116, 1572, 120.0, 485.70000000000175, 1572.0, 1572.0, 0.0932246403082628, 4.683936301998632, 0.05436080913808641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b9fc7b9-cfde-4adf-9ffd-58e7068f764f", 3, 0, 0.0, 398.66666666666663, 219, 737, 240.0, 737.0, 737.0, 737.0, 0.035690067454227495, 0.023363517464339675, 0.02288718518386333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 218.88888888888886, 114, 725, 122.5, 401.0000000000005, 725.0, 725.0, 0.09310842476063376, 1.5446441156768724, 0.05438396815174604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 138.16666666666666, 116, 423, 120.0, 167.4000000000004, 423.0, 423.0, 0.09321981231744453, 0.06927761442731961, 0.04679197610465477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 160.16666666666669, 115, 355, 122.5, 355.0, 355.0, 355.0, 0.03144917812814491, 0.008415112116320027, 0.01793585940120765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 158.88888888888889, 114, 367, 121.0, 364.3, 367.0, 367.0, 0.09311275955181725, 0.03268443762479696, 0.05266892529770219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 119.33333333333334, 114, 124, 119.5, 124.0, 124.0, 124.0, 0.03148862473431473, 0.023401214280091318, 0.015805813587341573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 122.83333333333334, 118, 130, 121.5, 130.0, 130.0, 130.0, 0.031788079470198675, 0.02502069536423841, 0.011299668874172185], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 542.6923076923076, 121, 1040, 508.0, 918.8, 1040.0, 1040.0, 0.1035138987315566, 0.019393304044208397, 0.07045041485185569], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1022.5454545454546, 818, 1663, 939.5, 1495.2, 1638.9999999999995, 1663.0, 0.0914810363969778, 0.047348583291404525, 0.04207770326462553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 280.6666666666667, 231, 480, 243.0, 480.0, 480.0, 480.0, 0.03142990345781321, 0.04871021170659137, 0.0706865895149842], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1131.2105263157896, 605, 2518, 939.0, 2101.2000000000003, 2213.999999999998, 2518.0, 0.2710078639825794, 80.71482725774513, 0.9855097339962725], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 221.5, 115, 601, 124.0, 486.20000000000005, 501.99999999999994, 601.0, 0.2564266940188474, 0.19056710366049107, 0.12395626322200141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=556c09eb-ca55-4c8c-8ffd-cbe74341b80c", 1, 0, 0.0, 1268.0, 1268, 1268, 1268.0, 1268.0, 1268.0, 1268.0, 0.7886435331230284, 0.14247954455835962, 0.5437327484227129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4cfce89-4895-40ab-9c34-512311ea3172", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 788.6964285714286, 560, 1095, 724.0, 1056.3, 1084.75, 1095.0, 0.25618621077720494, 75.32725215127796, 0.1288436509279888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bcf5ced-81fa-49a9-b2c5-b7b98ea0af9c", 3, 0, 0.0, 371.33333333333337, 215, 648, 251.0, 648.0, 648.0, 648.0, 0.06285223439693281, 0.039835058714462294, 0.04030563208397058], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 164.35714285714286, 115, 369, 123.0, 357.3, 364.45, 369.0, 0.25688544743940256, 0.45456682691425526, 0.1249306179929907], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1163.5535714285718, 786, 1820, 1175.0, 1534.3, 1682.35, 1820.0, 0.25546745983230384, 229.87006942100126, 0.12823268979863692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 139.33333333333331, 119, 349, 125.0, 218.20000000000007, 349.0, 349.0, 0.1033719944592611, 0.07722614820442845, 0.036745513655440466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bcf5ced-81fa-49a9-b2c5-b7b98ea0af9c", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 168.88823529411766, 114, 940, 125.0, 251.70000000000002, 356.45, 577.189999999996, 0.7211701622208647, 1.596284966147424, 0.3450000503758569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 160.14285714285714, 118, 370, 124.0, 370.0, 370.0, 370.0, 0.03603881895641877, 0.02790896819574227, 0.012810673925914484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 124.92857142857144, 119, 138, 125.0, 135.0, 138.0, 138.0, 0.11155111829996096, 0.09052634697975347, 0.03965293658318925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fee6a4b3-1c18-48d2-bd49-ec45976a66c5", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/556c09eb-ca55-4c8c-8ffd-cbe74341b80c", 3, 0, 0.0, 340.0, 225, 445, 350.0, 445.0, 445.0, 445.0, 0.025809337818422706, 0.025884951112812617, 0.016550909994235915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 309.57142857142856, 242, 480, 246.0, 480.0, 480.0, 480.0, 0.0370382128533181, 0.05740199589669513, 0.08329980879022615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 420.2777777777778, 237, 1696, 246.0, 878.8000000000013, 1696.0, 1696.0, 0.09304585609941433, 6.3203689575116435, 0.20793971920828314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 146.5333333333333, 116, 472, 123.0, 269.20000000000016, 472.0, 472.0, 0.08699888641425389, 0.07213091266181793, 0.030925385405066817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d939bf96-c855-4c77-aee6-d03460af11a2", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 124.35000000000001, 116, 133, 124.5, 130.60000000000002, 132.9, 133.0, 0.09207255317189947, 0.07148210915201178, 0.03272891538532364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd4fc5b0-7472-4ca2-a94a-a8787e6eca0d", 3, 0, 0.0, 326.0, 219, 519, 240.0, 519.0, 519.0, 519.0, 0.03427513795743028, 0.028573772235995748, 0.021979824796919806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2023cee0-5892-4939-b4ca-ec70b184ac23", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 120.66666666666667, 115, 125, 121.0, 124.4, 125.0, 125.0, 0.103292980209065, 0.07676363079990084, 0.05184823420650333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 214.0, 115, 365, 123.0, 364.4, 365.0, 365.0, 0.10329226891797906, 0.027638751644068614, 0.05890887211728493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 151.73333333333335, 115, 366, 119.0, 362.4, 366.0, 366.0, 0.103292980209065, 0.02784068607197455, 0.06072497469321985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 195.4, 114, 362, 120.0, 357.2, 362.0, 362.0, 0.1032965368114425, 0.027841644687459113, 0.060827941110644365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.46403712296983757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9280742459396751], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

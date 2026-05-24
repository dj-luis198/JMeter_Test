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

    var data = {"OkPercent": 97.1233913701741, "KoPercent": 2.8766086298258893};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7186076772934288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6e3cc6b-1f3e-4eaf-bba9-79b0dc31642e"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a64492b3-52bc-4905-9af7-0bbc37453d8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d05c8b8b-02df-4bcd-a7d4-cd4b20b2f1d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15b20b05-4608-4d5a-971d-39910d25826d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c98536af-136c-4bb8-8e7e-00d844ad3e5c"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e60f5d9c-ebdc-4f8a-a4bf-84288ae29a23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d05c8b8b-02df-4bcd-a7d4-cd4b20b2f1d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e60f5d9c-ebdc-4f8a-a4bf-84288ae29a23"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=751ea362-4426-499f-96dc-683e5c6a55a6"], "isController": false}, {"data": [0.9023668639053254, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c98536af-136c-4bb8-8e7e-00d844ad3e5c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15b20b05-4608-4d5a-971d-39910d25826d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08af91f7-2c51-4780-a92e-95bc476ffd2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/a7f63b67-b364-4e67-89d3-b62d6369332b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/751ea362-4426-499f-96dc-683e5c6a55a6"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a64492b3-52bc-4905-9af7-0bbc37453d8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84069b72-a2bf-49f5-900b-fb50d893eb62"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76e96df7-dc6a-4647-820a-0b31bc722296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/76e96df7-dc6a-4647-820a-0b31bc722296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fd411e4-2c71-42f0-8731-f803e3d6bf77"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84069b72-a2bf-49f5-900b-fb50d893eb62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18136be6-222f-4bd9-a552-9be00b2e1a87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7f63b67-b364-4e67-89d3-b62d6369332b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18136be6-222f-4bd9-a552-9be00b2e1a87"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 38, 2.8766086298258893, 459.4958364875097, 127, 2629, 144.0, 1298.8, 1553.4999999999993, 2086.24, 5.1569935625417225, 750.5891086203969, 3.7838046466620083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2211.912280701754, 1585, 3199, 2161.0, 2657.2000000000003, 2794.699999999999, 3199.0, 0.2568551021787622, 309.0831952126941, 1.2629545307324876], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 156.6875, 134, 392, 140.0, 227.50000000000017, 392.0, 392.0, 0.08634646519158122, 0.06703656233135456, 0.030693470048569885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 483.9411764705883, 261, 1595, 276.0, 1054.9999999999995, 1595.0, 1595.0, 0.08473773670489834, 6.08688375104053, 0.18930180622224216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 451.6470588235295, 267, 1719, 276.0, 820.5999999999992, 1719.0, 1719.0, 0.09311956003746692, 6.688967146597576, 0.20802657228268906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 238.2, 133, 400, 134.0, 400.0, 400.0, 400.0, 0.03182584895452086, 0.023651827201553104, 0.015975084338499732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 238.4, 131, 399, 140.0, 399.0, 399.0, 399.0, 0.031771852680273494, 0.008501452767963805, 0.018119884731718473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 186.8, 133, 392, 136.0, 392.0, 392.0, 392.0, 0.031825646378877956, 0.00857800625055695, 0.018709999140707548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 186.4, 130, 394, 135.0, 394.0, 394.0, 394.0, 0.03177306406720638, 0.00856383367436422, 0.018710114875513134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 143.5, 134, 168, 136.0, 168.0, 168.0, 168.0, 0.03445009043148738, 0.010160085263973818, 0.021295807854620617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6e3cc6b-1f3e-4eaf-bba9-79b0dc31642e", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1541.508771929824, 1042, 2629, 1431.0, 2109.6000000000004, 2251.499999999999, 2629.0, 0.24242733559598847, 290.027374751193, 0.47869928962411], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 491.78571428571433, 134, 986, 543.0, 861.5, 986.0, 986.0, 0.10839017365654251, 0.023120616004583355, 0.07218954925172069], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 491.78571428571433, 134, 986, 543.0, 861.5, 986.0, 986.0, 0.10824435389718333, 0.023089511315400855, 0.07209243101355374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1181.4583333333335, 294, 2554, 1168.0, 2032.5, 2482.0, 2554.0, 0.09741603955091206, 0.030157113806288202, 0.043951377219259145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 159.57894736842107, 129, 393, 132.0, 391.0, 393.0, 393.0, 0.08311461067366578, 0.0353800989720035, 0.04666652996500437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 200.5, 132, 397, 136.5, 397.0, 397.0, 397.0, 0.022989562738516715, 0.006196405581865834, 0.013537799151685136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 147.57894736842107, 131, 406, 134.0, 137.0, 406.0, 406.0, 0.08311315637521653, 0.06176671093900369, 0.04171890857115361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 132.75, 127, 139, 132.5, 139.0, 139.0, 139.0, 0.023025293284673214, 0.006206036080634577, 0.013536354059934837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 241.84210526315795, 130, 1043, 133.0, 1041.0, 1043.0, 1043.0, 0.08311461067366578, 2.5925128499562557, 0.04819160788495188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 288.6842105263158, 129, 1482, 133.0, 1471.0, 1482.0, 1482.0, 0.08311388351807945, 7.892256178314275, 0.04811002036290146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 181.81249999999997, 130, 396, 134.0, 392.5, 396.0, 396.0, 0.0830108017805817, 0.022374005167422408, 0.04880127214053728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 132.81250000000003, 130, 140, 132.0, 138.6, 140.0, 140.0, 0.08312292842076827, 0.0224042268009102, 0.048948365075901626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 133.75, 131, 139, 133.5, 137.6, 139.0, 139.0, 0.08311904205304033, 0.0617710849632458, 0.04172186290553001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 200.75, 131, 398, 137.0, 398.0, 398.0, 398.0, 0.022989430609277384, 0.00615146873724805, 0.013111159644353509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 190.875, 128, 530, 133.5, 435.5000000000001, 530.0, 530.0, 0.0831224965841849, 0.0222417617813151, 0.04740579883316796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 195.5, 133, 381, 134.0, 381.0, 381.0, 381.0, 0.023024233005238013, 0.017110782536119265, 0.011557085707707363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 138.0, 135, 142, 137.5, 142.0, 142.0, 142.0, 0.0225218884603474, 0.017727189549843755, 0.008005827538639116], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 545.0, 131, 1178, 563.5, 1070.5, 1178.0, 1178.0, 0.1061305557450744, 0.021809473857769893, 0.07220964290858368], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1305.1739130434783, 802, 1961, 1235.0, 1688.0000000000002, 1919.1999999999994, 1961.0, 0.1034540146904701, 0.053545534947215964, 0.047584805585167395], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 244.14285714285717, 133, 513, 243.0, 435.5, 513.0, 513.0, 0.10888078331946399, 0.1737565960367395, 0.07035934547094828], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 397.75, 267, 780, 272.0, 780.0, 780.0, 780.0, 0.022971475170706777, 0.03560129989835122, 0.051663386052868854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a64492b3-52bc-4905-9af7-0bbc37453d8d", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d05c8b8b-02df-4bcd-a7d4-cd4b20b2f1d3", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15b20b05-4608-4d5a-971d-39910d25826d", 3, 0, 0.0, 422.0, 288, 534, 444.0, 534.0, 534.0, 534.0, 0.024059089122885808, 0.024129574735550514, 0.015428517438829767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c98536af-136c-4bb8-8e7e-00d844ad3e5c", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 172.52941176470586, 129, 521, 134.0, 425.7999999999999, 521.0, 521.0, 0.0849044824572356, 0.0630979601073792, 0.0426180702959171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 889.1, 772, 1060, 852.5, 1059.2, 1060.0, 1060.0, 0.04994580879745476, 14.685726143384427, 0.028484719079798416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 193.94117647058826, 127, 407, 134.0, 399.8, 407.0, 407.0, 0.08479395069979949, 0.03018056747104536, 0.04794014607004978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1306.1, 1082, 1709, 1293.5, 1681.2, 1709.0, 1709.0, 0.049887005931565004, 44.8884156292248, 0.028402465291115623], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1338.0, 675, 3130, 1146.5, 2354.2000000000003, 2562.85, 3130.0, 0.25944423338861966, 73.12335096550318, 0.9436750116402435], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 292.3, 133, 410, 383.5, 409.0, 410.0, 410.0, 0.05010923813914333, 0.08866986280090598, 0.02774603322743581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e60f5d9c-ebdc-4f8a-a4bf-84288ae29a23", 3, 0, 0.0, 441.33333333333337, 242, 815, 267.0, 815.0, 815.0, 815.0, 0.052503543989219276, 0.03375471984983986, 0.033669264862878245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 203.66666666666666, 130, 395, 135.0, 394.4, 395.0, 395.0, 0.07642221746706203, 0.05679424559808027, 0.03836037087702137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 201.8, 128, 399, 133.0, 395.4, 399.0, 399.0, 0.07642299618903992, 0.020449122027145446, 0.04358499001406183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 221.4666666666667, 130, 406, 134.0, 401.2, 406.0, 406.0, 0.07642299618903992, 0.020598385691577167, 0.0449283629939473], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 242.40350877192986, 129, 544, 135.0, 535.4, 540.0, 544.0, 0.24376996668477122, 0.18116107875694423, 0.11783802100484546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 202.46666666666667, 131, 396, 134.0, 396.0, 396.0, 396.0, 0.07642221746706203, 0.02059817580166906, 0.04500253626234219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d05c8b8b-02df-4bcd-a7d4-cd4b20b2f1d3", 3, 0, 0.0, 340.0, 243, 463, 314.0, 463.0, 463.0, 463.0, 0.020101579984186758, 0.0237593870190697, 0.012890661643505181], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 877.1929824561404, 648, 1317, 786.0, 1085.2000000000003, 1176.3, 1317.0, 0.24329342467507523, 71.53634495646328, 0.12235948604264038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 159.4, 131, 394, 133.5, 368.1000000000001, 394.0, 394.0, 0.05012430828454567, 0.03725058457474537, 0.028145973890247814], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 189.59649122807016, 129, 402, 135.0, 394.2, 401.1, 402.0, 0.2439734282974935, 0.43171860554204905, 0.11865113993374195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 751.8500000000003, 130, 1945, 268.0, 1659.7000000000003, 1931.35, 1945.0, 0.08926100811382563, 36.15597764932251, 0.04902381930001517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 240.64705882352942, 129, 1192, 133.0, 553.5999999999995, 1192.0, 1192.0, 0.08490405841399219, 4.515468809307982, 0.0494850974648647], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1294.9122807017545, 909, 2088, 1293.0, 1566.2, 1714.099999999999, 2088.0, 0.24303201627035392, 218.68063544478056, 0.121990680041955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 557.8, 130, 1067, 387.5, 1060.2, 1066.7, 1067.0, 0.08936430700214026, 11.837480605152747, 0.049167822817388504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 256.05882352941177, 130, 1054, 134.0, 628.3999999999996, 1054.0, 1054.0, 0.08479395069979949, 1.4881124024869568, 0.04950372937511847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 172.64705882352942, 134, 481, 137.0, 417.79999999999995, 481.0, 481.0, 0.09247976325180607, 0.06908888563245277, 0.03287366584341544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e60f5d9c-ebdc-4f8a-a4bf-84288ae29a23", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 563.9285714285714, 134, 2091, 524.0, 1564.5, 2091.0, 2091.0, 0.10817911370397558, 0.023075594985125375, 0.07238100297492563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=751ea362-4426-499f-96dc-683e5c6a55a6", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, 7.100591715976331, 208.85207100591708, 130, 1899, 139.0, 347.0, 438.5, 1634.4000000000042, 0.7177927660080529, 1.635104678554136, 0.34157953297811794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 187.2, 134, 392, 137.0, 392.0, 392.0, 392.0, 0.030737075059937297, 0.023803223166533473, 0.010926069650212087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 478.4666666666667, 263, 790, 522.0, 790.0, 790.0, 790.0, 0.07637007922122885, 0.1183587067618068, 0.1717580980922754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c98536af-136c-4bb8-8e7e-00d844ad3e5c", 3, 0, 0.0, 518.6666666666666, 243, 963, 350.0, 963.0, 963.0, 963.0, 0.06133464180569185, 0.027752328160778543, 0.039332436314196924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15b20b05-4608-4d5a-971d-39910d25826d", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08af91f7-2c51-4780-a92e-95bc476ffd2a", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 158.73684210526315, 133, 405, 138.0, 191.0, 405.0, 405.0, 0.08520637881859112, 0.06914697343579027, 0.030288204970671067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7f63b67-b364-4e67-89d3-b62d6369332b", 3, 0, 0.0, 1148.6666666666667, 513, 2314, 619.0, 2314.0, 2314.0, 2314.0, 0.021753317380900587, 0.02571168470379233, 0.01394988126314263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/751ea362-4426-499f-96dc-683e5c6a55a6", 3, 0, 0.0, 416.33333333333337, 228, 762, 259.0, 762.0, 762.0, 762.0, 0.07060650992021465, 0.03194760702770129, 0.04527826319753348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 610.7391304347825, 170, 1491, 559.0, 1049.6000000000001, 1412.399999999999, 1491.0, 0.10194357644660151, 0.06261963826651597, 0.04609362880349267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 147.04999999999998, 131, 396, 134.0, 138.9, 383.1499999999998, 396.0, 0.08936231055190164, 0.06641085774413784, 0.0448556910387475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 211.10000000000002, 130, 398, 134.0, 396.9, 397.95, 398.0, 0.08936470630289274, 0.08431176050705534, 0.04758845151071036], "isController": false}, {"data": ["login", 23, 0, 0.0, 2985.8695652173915, 1533, 4384, 3030.0, 3745.0, 4259.799999999998, 4384.0, 0.10161703631704516, 52.98957389878059, 0.2265802760780242], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 479.6, 267, 800, 275.0, 800.0, 800.0, 800.0, 0.03174502396749309, 0.04919858694962065, 0.07139530292689121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a64492b3-52bc-4905-9af7-0bbc37453d8d", 3, 0, 0.0, 786.3333333333334, 260, 1590, 509.0, 1590.0, 1590.0, 1590.0, 0.027414034157886562, 0.027494348711083492, 0.017579963310884284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 153.94117647058823, 131, 399, 137.0, 213.39999999999984, 399.0, 399.0, 0.08453589792041691, 0.06843775329690001, 0.030049869963898197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84069b72-a2bf-49f5-900b-fb50d893eb62", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 342.5625, 264, 662, 272.0, 570.3000000000001, 662.0, 662.0, 0.0829505511027239, 0.1285571529297098, 0.1865577335835675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76e96df7-dc6a-4647-820a-0b31bc722296", 1, 0, 0.0, 2091.0, 2091, 2091, 2091.0, 2091.0, 2091.0, 2091.0, 0.47824007651841227, 0.0864007950741272, 0.32972411525585843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76e96df7-dc6a-4647-820a-0b31bc722296", 3, 0, 0.0, 1172.3333333333333, 219, 2120, 1178.0, 2120.0, 2120.0, 2120.0, 0.025616941337204338, 0.025691990970028177, 0.016427530740329606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd411e4-2c71-42f0-8731-f803e3d6bf77", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84069b72-a2bf-49f5-900b-fb50d893eb62", 3, 0, 0.0, 485.6666666666667, 256, 733, 468.0, 733.0, 733.0, 733.0, 0.0303437951996116, 0.03043269303711046, 0.019458748874750926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 154.06666666666666, 133, 397, 137.0, 244.60000000000008, 397.0, 397.0, 0.07877944381712666, 0.06531615996166067, 0.02800363041936924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 926.7499999999999, 265, 2078, 659.0, 1793.6000000000004, 2064.3999999999996, 2078.0, 0.08920646390037422, 48.100913732052774, 0.19035648854365986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18136be6-222f-4bd9-a552-9be00b2e1a87", 3, 0, 0.0, 637.3333333333334, 358, 936, 618.0, 936.0, 936.0, 936.0, 0.02692563140605647, 0.02244679102568705, 0.017266762327451578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 139.20000000000002, 132, 162, 136.5, 157.50000000000003, 161.85, 162.0, 0.09280785525686894, 0.07205297356368243, 0.032990292298340135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7f63b67-b364-4e67-89d3-b62d6369332b", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18136be6-222f-4bd9-a552-9be00b2e1a87", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 478.9473684210526, 264, 1878, 272.0, 1616.0, 1878.0, 1878.0, 0.08306446676984147, 10.57560174604788, 0.18457679337276708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, 44.44444444444444, 873.7777777777778, 131, 1842, 1260.5, 1825.8, 1842.0, 1842.0, 0.08973707038377553, 59.65330176333343, 0.138841242035835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 135.29411764705884, 131, 147, 135.0, 142.2, 147.0, 147.0, 0.09318898177333151, 0.06925470227490749, 0.04677650061669179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.11764705882354, 130, 399, 134.0, 398.2, 399.0, 399.0, 0.0931884709416421, 0.033168414864109284, 0.05268617480512647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 284.2352941176471, 132, 1585, 135.0, 675.3999999999992, 1585.0, 1585.0, 0.09318898177333151, 4.956087476017541, 0.05431384473071125], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1181.4583333333335, 294, 2554, 1168.0, 2032.5, 2482.0, 2554.0, 0.09786850550714236, 0.030297183833754033, 0.04415551713310525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 234.99999999999997, 131, 779, 135.0, 511.7999999999997, 779.0, 779.0, 0.09318796011555308, 1.6354251460858316, 0.05440425313961201], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 26.31578947368421, 0.757002271006813], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.3028009084027252], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.3028009084027252], "isController": false}, {"data": ["401/Unauthorized", 20, 52.63157894736842, 1.514004542013626], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 38, "401/Unauthorized", 20, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

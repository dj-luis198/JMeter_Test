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

    var data = {"OkPercent": 98.73793615441723, "KoPercent": 1.2620638455827766};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8292838874680307, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64823582-04a5-4d89-9e57-5c952dd501fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d929dc4-527e-4baf-a73c-18d84b592a02"], "isController": false}, {"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb431f2d-3076-4d33-973c-8ac39d0100b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d454cbb-5188-4986-bed7-ea5588584866"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4875810b-5935-4783-a5bd-c255284fa135"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=554eb71f-0ce4-464e-8ce0-7c3b4aa47187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58d994fb-5a5d-41bd-85cc-83234c7b8854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bacb1ac-d850-4d5c-9dba-f42b68f6c3a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54506858-262d-41b2-9833-39eb2c8dece9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33033736-4121-447e-948f-a48ed1e39618"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6c8d6de-650a-4115-8bbc-430c31c3bc4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da4ec575-3485-47aa-ac0d-085abf8fae80"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42c11c0d-71db-42ef-8975-6ef32daeaac3"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bacb1ac-d850-4d5c-9dba-f42b68f6c3a0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de5f396b-d6aa-4748-9199-fee12dad5627"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64823582-04a5-4d89-9e57-5c952dd501fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54506858-262d-41b2-9833-39eb2c8dece9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ba44ee6-b564-414b-a03d-027247de8a7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06e5c9e5-0a5b-4a68-91bc-10f68b224152"], "isController": false}, {"data": [0.3712121212121212, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb7103a6-b3bd-4035-b98f-e15b77cc33cb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/58d994fb-5a5d-41bd-85cc-83234c7b8854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8482142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/554eb71f-0ce4-464e-8ce0-7c3b4aa47187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441489361702128, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4875810b-5935-4783-a5bd-c255284fa135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ba44ee6-b564-414b-a03d-027247de8a7d"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6c8d6de-650a-4115-8bbc-430c31c3bc4b"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da4ec575-3485-47aa-ac0d-085abf8fae80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d454cbb-5188-4986-bed7-ea5588584866"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42c11c0d-71db-42ef-8975-6ef32daeaac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de5f396b-d6aa-4748-9199-fee12dad5627"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 17, 1.2620638455827766, 293.4699331848554, 78, 2066, 95.0, 814.0, 1017.7999999999997, 1392.6799999999994, 5.24430601518396, 711.3847949009636, 3.828216249756667], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/64823582-04a5-4d89-9e57-5c952dd501fb", 3, 0, 0.0, 248.66666666666669, 172, 387, 187.0, 387.0, 387.0, 387.0, 0.038768705900597035, 0.03231987493861621, 0.02486144226047401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d929dc4-527e-4baf-a73c-18d84b592a02", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.5733140709156194, 1.0712382181328546], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1357.8035714285718, 974, 1793, 1392.5, 1640.3, 1716.7499999999998, 1793.0, 0.2507724687653934, 301.76438093345575, 1.233046269759527], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb431f2d-3076-4d33-973c-8ac39d0100b4", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.6399517785571143, 1.195750876753507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d454cbb-5188-4986-bed7-ea5588584866", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 447.53846153846155, 88, 771, 447.0, 690.9999999999999, 771.0, 771.0, 0.0962392656203731, 0.018232829619484747, 0.06505837975644062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 447.53846153846155, 88, 771, 447.0, 690.9999999999999, 771.0, 771.0, 0.09942030315544746, 0.018835487121246882, 0.0672087821586442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 133.0, 79, 252, 83.0, 245.0, 252.0, 252.0, 0.07887777680910332, 0.027341268852826523, 0.04463632415029953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 99.6842105263158, 79, 246, 83.0, 244.0, 246.0, 246.0, 0.07887646699850134, 0.05861815565025344, 0.03959228909885712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 127.47368421052633, 80, 467, 82.0, 245.0, 467.0, 467.0, 0.07882639937602681, 1.2400005211877063, 0.04606174622255597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 196.89473684210526, 79, 996, 86.0, 245.0, 996.0, 996.0, 0.07882738048317035, 3.7532342887177275, 0.0459853396630337], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 225.15384615384616, 79, 421, 185.0, 409.0, 421.0, 421.0, 0.09635268045745288, 0.2176476187917374, 0.062283264373225816], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4875810b-5935-4783-a5bd-c255284fa135", 3, 0, 0.0, 490.33333333333337, 222, 828, 421.0, 828.0, 828.0, 828.0, 0.027525461051472612, 0.027606102050646848, 0.017651418708138363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=554eb71f-0ce4-464e-8ce0-7c3b4aa47187", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58d994fb-5a5d-41bd-85cc-83234c7b8854", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 82.94117647058825, 80, 90, 82.0, 86.0, 90.0, 90.0, 0.1033516326518205, 0.07680721918753458, 0.05187767498343334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 100.88235294117646, 79, 245, 82.0, 242.6, 245.0, 245.0, 0.1033528893212147, 0.02765497233790315, 0.05894344469100525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 537.0, 481, 646, 484.0, 646.0, 646.0, 646.0, 0.03377807802736024, 9.931876477790913, 0.019264060124978888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 890.0, 718, 981, 971.0, 981.0, 981.0, 981.0, 0.03368931711754203, 30.31370676186706, 0.019180538944850587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bacb1ac-d850-4d5c-9dba-f42b68f6c3a0", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 183.33333333333334, 83, 234, 233.0, 234.0, 234.0, 234.0, 0.03387342629706995, 0.05994008637723706, 0.018756086631287756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 83.73333333333333, 79, 96, 83.0, 90.0, 96.0, 96.0, 0.1871958068139274, 0.13911719627480346, 0.09396352021714714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 124.33333333333333, 80, 243, 82.0, 238.8, 243.0, 243.0, 0.18720281553034557, 0.0875806922136109, 0.10466782420407604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 211.4, 79, 932, 82.0, 788.0000000000001, 932.0, 932.0, 0.18720047923322683, 22.502838232265873, 0.10790840124550719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 145.93333333333334, 78, 634, 82.0, 542.8000000000001, 634.0, 634.0, 0.18719347069174228, 7.382539997004905, 0.10808716741960041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 83.33333333333333, 82, 86, 82.0, 86.0, 86.0, 86.0, 0.03393012655937207, 0.025215650695002093, 0.01905256130042865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54506858-262d-41b2-9833-39eb2c8dece9", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 654.1333333333332, 79, 1045, 879.0, 1027.0, 1045.0, 1045.0, 0.0990635195287218, 59.4339195761072, 0.05256300027077362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 91.94117647058825, 80, 237, 83.0, 117.7999999999999, 237.0, 237.0, 0.10335037601298568, 0.027856156034750043, 0.06075871714825915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 449.46666666666664, 81, 799, 565.0, 709.6, 799.0, 799.0, 0.0990635195287218, 19.427542877993368, 0.05265974198906338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 82.70588235294117, 79, 104, 81.0, 87.99999999999999, 104.0, 104.0, 0.1033528893212147, 0.027856833449858648, 0.06086112525458248], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 552.1538461538461, 86, 1057, 510.0, 968.1999999999999, 1057.0, 1057.0, 0.09929348863853352, 0.01881146171472217, 0.06791370297880465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33033736-4121-447e-948f-a48ed1e39618", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 296.93333333333334, 162, 1016, 170.0, 870.8000000000001, 1016.0, 1016.0, 0.1869951131943752, 30.0793205026117, 0.41417713190011973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6c8d6de-650a-4115-8bbc-430c31c3bc4b", 3, 0, 0.0, 266.6666666666667, 168, 447, 185.0, 447.0, 447.0, 447.0, 0.024888003982080634, 0.024960918056246888, 0.015960080678612907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da4ec575-3485-47aa-ac0d-085abf8fae80", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 502.19999999999993, 104, 1110, 450.5, 871.0000000000001, 1098.35, 1110.0, 0.09178058932316405, 0.0563769440276076, 0.04149845005529781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 94.66666666666667, 81, 243, 84.0, 153.60000000000005, 243.0, 243.0, 0.09906090264294487, 0.07361850284304791, 0.04972392964694694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 137.2, 82, 247, 84.0, 246.4, 247.0, 247.0, 0.09906417377176935, 0.12570056945389224, 0.050950974791469913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42c11c0d-71db-42ef-8975-6ef32daeaac3", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["login", 20, 0, 0.0, 2240.2, 1413, 3366, 2140.0, 3328.000000000001, 3365.7, 3366.0, 0.09373960076304036, 16.953314859308577, 0.16474917919262083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 89.05882352941175, 83, 106, 87.0, 101.19999999999999, 106.0, 106.0, 0.09845768925594944, 0.07970842225896689, 0.03499863172770078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bacb1ac-d850-4d5c-9dba-f42b68f6c3a0", 3, 0, 0.0, 439.3333333333333, 296, 617, 405.0, 617.0, 617.0, 617.0, 0.024464233290928665, 0.028915895533646475, 0.015688326687216623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 761.2666666666668, 167, 1127, 962.0, 1110.2, 1127.0, 1127.0, 0.09900663344444077, 79.01538289784166, 0.20578038884855285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 323.63157894736844, 163, 1076, 322.0, 490.0, 1076.0, 1076.0, 0.0787979578887124, 5.077259907287982, 0.17615733852639526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 615.8, 79, 1067, 800.0, 1067.0, 1067.0, 1067.0, 0.05218335142356183, 37.46324335184103, 0.08443103187359105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de5f396b-d6aa-4748-9199-fee12dad5627", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 981.2173913043481, 237, 1749, 1008.0, 1395.4, 1680.999999999999, 1749.0, 0.093103839116566, 0.02947444906815201, 0.042005833663919426], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 187.0588235294118, 164, 328, 167.0, 325.6, 328.0, 328.0, 0.10329825243662348, 0.16009211583683736, 0.2323201907827577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 96.73684210526316, 81, 247, 85.0, 108.0, 247.0, 247.0, 0.11696050428444794, 0.09080429775989855, 0.041575804257362355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 283.92857142857144, 161, 848, 249.0, 588.5, 848.0, 848.0, 0.07304944925933075, 6.347449881229422, 0.16295489587844572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 95.66666666666666, 79, 242, 83.0, 167.00000000000006, 242.0, 242.0, 0.07067304294565242, 0.05252166570472803, 0.03547455475982944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 114.13333333333334, 78, 243, 83.0, 242.4, 243.0, 243.0, 0.07067404189557204, 0.02598743415535097, 0.03991058850274687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 166.53333333333336, 79, 883, 82.0, 499.0000000000002, 883.0, 883.0, 0.07062412896907605, 4.254280741800539, 0.041114645914158726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 132.06666666666666, 79, 485, 82.0, 342.80000000000007, 485.0, 485.0, 0.07067437488515414, 1.4031532108546416, 0.04121291509416182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 929.375, 637, 1446, 874.0, 1282.7, 1379.3999999999999, 1446.0, 0.244237520989162, 292.1929858036941, 0.48227369867195846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 981.2173913043481, 237, 1749, 1008.0, 1395.4, 1680.999999999999, 1749.0, 0.0925530973095217, 0.02930009738195456, 0.041757354450194364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64823582-04a5-4d89-9e57-5c952dd501fb", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 102.625, 80, 236, 83.0, 236.0, 236.0, 236.0, 0.040115532734274706, 0.01081238968228498, 0.023622720936296533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 143.12499999999997, 81, 249, 84.5, 249.0, 249.0, 249.0, 0.04011573389227923, 0.010812443900653385, 0.023583663870265715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 208.15789473684208, 78, 973, 83.0, 946.0, 973.0, 973.0, 0.1213313239163197, 11.521274789107002, 0.07023197830723646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 157.6315789473684, 79, 647, 82.0, 484.0, 647.0, 647.0, 0.1214569722694555, 3.788488675735454, 0.07042331949895803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 101.75, 79, 240, 80.5, 240.0, 240.0, 240.0, 0.040116136214340514, 0.010734200510477833, 0.022878733934741078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 116.73684210526316, 79, 247, 83.0, 247.0, 247.0, 247.0, 0.12145231398619279, 0.0902589950620046, 0.06096336854385068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.125, 80, 247, 83.5, 247.0, 247.0, 247.0, 0.04011452697451223, 0.029811674831644343, 0.02013561217275321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 114.78947368421052, 79, 245, 82.0, 243.0, 245.0, 245.0, 0.12132822477650064, 0.051646811143039595, 0.0681224058109834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 88.5, 84, 94, 88.5, 94.0, 94.0, 94.0, 0.041556498657205634, 0.03270950968526147, 0.014772036632053568], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 454.00000000000006, 79, 828, 400.0, 744.3999999999999, 828.0, 828.0, 0.0994545301538485, 0.01863278231698454, 0.06768765348511625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1242.6000000000001, 843, 1774, 1186.5, 1685.3000000000002, 1769.95, 1774.0, 0.09268398930426763, 0.0479712054016229, 0.042631014611630914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 268.625, 162, 488, 176.0, 488.0, 488.0, 488.0, 0.04009783872649264, 0.06214381841693733, 0.0901809790889771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54506858-262d-41b2-9833-39eb2c8dece9", 3, 0, 0.0, 258.3333333333333, 184, 399, 192.0, 399.0, 399.0, 399.0, 0.025823333964570386, 0.02589898826329471, 0.016559885387436087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ba44ee6-b564-414b-a03d-027247de8a7d", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06e5c9e5-0a5b-4a68-91bc-10f68b224152", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["addBook", 66, 8, 12.121212121212121, 933.7272727272725, 420, 3172, 712.5, 1613.2000000000003, 2425.699999999999, 3172.0, 0.3089251277826665, 96.35614894842588, 1.123802915129842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb7103a6-b3bd-4035-b98f-e15b77cc33cb", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58d994fb-5a5d-41bd-85cc-83234c7b8854", 3, 0, 0.0, 903.0, 243, 2066, 400.0, 2066.0, 2066.0, 2066.0, 0.023706232368489677, 0.028019964104813153, 0.015202238856095267], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 148.85714285714283, 80, 342, 84.0, 330.90000000000003, 336.9, 342.0, 0.24505728213970013, 0.18211776534014826, 0.11846030728432771], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 513.2857142857142, 384, 752, 479.5, 651.5, 731.3, 752.0, 0.24502082677027548, 72.04425852759985, 0.12322824783856628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/554eb71f-0ce4-464e-8ce0-7c3b4aa47187", 3, 0, 0.0, 245.0, 166, 396, 173.0, 396.0, 396.0, 396.0, 0.028384093553972353, 0.02830093702988845, 0.01820203916058774], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 122.78571428571429, 79, 339, 85.0, 247.0, 252.45, 339.0, 0.24536006589670342, 0.434172304106276, 0.11932550079742021], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 778.7142857142859, 552, 1113, 771.0, 969.5000000000001, 1042.85, 1113.0, 0.24463656180786417, 220.1244083399225, 0.12279608668871309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 86.07142857142858, 80, 101, 85.0, 94.0, 101.0, 101.0, 0.07488312883107436, 0.05594296245680848, 0.026618612201670964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 8, 4.25531914893617, 168.0372340425532, 81, 1885, 88.0, 287.5999999999998, 411.7499999999999, 1476.4899999999932, 0.7508916838746011, 1.5194447994759734, 0.36533576441172827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 119.86666666666666, 82, 254, 89.0, 250.4, 254.0, 254.0, 0.0715379222525861, 0.055399972994434346, 0.025429495800723963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4875810b-5935-4783-a5bd-c255284fa135", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.57894736842105, 83, 345, 86.0, 96.0, 345.0, 345.0, 0.08212096850876965, 0.06664309065506599, 0.029191438024601713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ba44ee6-b564-414b-a03d-027247de8a7d", 3, 0, 0.0, 340.33333333333337, 175, 619, 227.0, 619.0, 619.0, 619.0, 0.02450860251948434, 0.028968338459716025, 0.01571677961047661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 286.59999999999997, 163, 973, 169.0, 679.6000000000001, 973.0, 973.0, 0.07059620851296147, 5.732623552189424, 0.15756834742512096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6c8d6de-650a-4115-8bbc-430c31c3bc4b", 1, 0, 0.0, 1057.0, 1057, 1057, 1057.0, 1057.0, 1057.0, 1057.0, 0.9460737937559129, 0.17092153500473037, 0.6522735335856197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 342.57894736842104, 161, 1218, 168.0, 1191.0, 1218.0, 1218.0, 0.12126240546319048, 15.4388868889013, 0.2694560842614162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da4ec575-3485-47aa-ac0d-085abf8fae80", 3, 0, 0.0, 496.0, 169, 795, 524.0, 795.0, 795.0, 795.0, 0.04162330905306972, 0.02675977714186611, 0.02669203087062088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d454cbb-5188-4986-bed7-ea5588584866", 3, 0, 0.0, 376.6666666666667, 259, 467, 404.0, 467.0, 467.0, 467.0, 0.016975623005364298, 0.023402266740793556, 0.01088606032570562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42c11c0d-71db-42ef-8975-6ef32daeaac3", 3, 0, 0.0, 308.6666666666667, 185, 391, 350.0, 391.0, 391.0, 391.0, 0.0529567519858782, 0.034390859443954105, 0.03395989629302736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 109.86666666666667, 82, 252, 85.0, 249.0, 252.0, 252.0, 0.17510477102132777, 0.14517963925498759, 0.0622442740739876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de5f396b-d6aa-4748-9199-fee12dad5627", 3, 0, 0.0, 241.33333333333331, 163, 389, 172.0, 389.0, 389.0, 389.0, 0.0501269883705387, 0.03222682357806443, 0.03214523668293009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 86.0, 83, 95, 85.0, 91.4, 95.0, 95.0, 0.09777719835734307, 0.07591100849032006, 0.0347567384785868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 82.28571428571428, 79, 86, 82.0, 85.5, 86.0, 86.0, 0.07308071765264734, 0.05431096302115687, 0.036683094602989005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 140.0, 78, 244, 88.0, 243.0, 244.0, 244.0, 0.07308376966083911, 0.02739621778441332, 0.041242166333439474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 154.35714285714286, 80, 768, 81.5, 507.0, 768.0, 768.0, 0.07308224362487928, 4.715400329196356, 0.042515758358781616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 185.35714285714286, 79, 729, 87.5, 486.5, 729.0, 729.0, 0.07308224362487928, 1.553191393913293, 0.04258712773732154], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3711952487008166], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07423904974016332], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07423904974016332], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7423904974016332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

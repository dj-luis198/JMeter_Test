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

    var data = {"OkPercent": 98.19466248037676, "KoPercent": 1.805337519623234};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7336480107889414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8d060b4-b042-439a-900d-af2904e77467"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a35e1cd4-77a5-4d96-868b-d5432309ceef"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c03e6fee-5ee3-4927-bd06-8acb31ae5f35"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ec1f58a-9ace-435f-83ce-9ba8186aac9d"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a1e13b2-c31f-4d45-9593-5ccc5a33d382"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/2ea6a14f-a309-43a0-a7bc-c5ab7973676b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ece9498-32fb-43be-a861-19c4045e665c"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c10842a7-e07b-4eeb-a512-f1fb7460f389"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ece9498-32fb-43be-a861-19c4045e665c"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cec066f-c470-4ab4-bf69-c321622c8c69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28ea3a0d-9364-4e48-b59e-c9de37eff168"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dd4f4e4-fb1e-4871-99e8-a9e266199c02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f60833f8-8bfa-4e54-98cc-ac29d7e3593b"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71b3b244-9f6b-4006-b254-e73b9d335cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a35e1cd4-77a5-4d96-868b-d5432309ceef"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c03e6fee-5ee3-4927-bd06-8acb31ae5f35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ec1f58a-9ace-435f-83ce-9ba8186aac9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.07894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ea6a14f-a309-43a0-a7bc-c5ab7973676b"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cec066f-c470-4ab4-bf69-c321622c8c69"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8bd2c4fa-9761-4656-afa5-86a35c7a1ff2"], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9298245614035088, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a1e13b2-c31f-4d45-9593-5ccc5a33d382"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd2c4fa-9761-4656-afa5-86a35c7a1ff2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0321018b-66d4-4a07-ba40-ba71badcb2e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3dd4f4e4-fb1e-4871-99e8-a9e266199c02"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28ea3a0d-9364-4e48-b59e-c9de37eff168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71b3b244-9f6b-4006-b254-e73b9d335cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 23, 1.805337519623234, 460.1679748822603, 124, 3118, 154.0, 1267.5, 1563.0, 2242.0, 5.003652587838846, 698.661940537932, 3.657409015460658], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e8d060b4-b042-439a-900d-af2904e77467", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.6867439516129031, 1.283182123655914], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2181.890909090909, 1537, 3599, 2109.0, 2672.7999999999997, 2747.6, 3599.0, 0.24711992954835466, 297.3691608790056, 1.21508676296481], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a35e1cd4-77a5-4d96-868b-d5432309ceef", 3, 0, 0.0, 575.0, 226, 1015, 484.0, 1015.0, 1015.0, 1015.0, 0.044264109184802655, 0.02845755717447436, 0.02838551272593139], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 492.3571428571429, 131, 847, 520.5, 739.5, 847.0, 847.0, 0.09270970604401062, 0.019019199600686054, 0.062062991692548135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 492.3571428571429, 131, 847, 520.5, 739.5, 847.0, 847.0, 0.0911084646271386, 0.018690708319504368, 0.060991066896390146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 178.81249999999997, 125, 395, 131.0, 392.2, 395.0, 395.0, 0.07808306085598556, 0.0355529561758821, 0.04371202601141965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 198.99999999999997, 128, 428, 133.0, 402.8, 428.0, 428.0, 0.07808191769189853, 0.05802767515970192, 0.03919346259144124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 284.4375, 126, 1058, 132.0, 856.4000000000002, 1058.0, 1058.0, 0.07773065356905154, 2.8752561164308026, 0.04493803409460792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 353.125, 128, 1522, 130.5, 1354.0000000000002, 1522.0, 1522.0, 0.07764577995185962, 8.751538129537426, 0.0448131405776846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c03e6fee-5ee3-4927-bd06-8acb31ae5f35", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ec1f58a-9ace-435f-83ce-9ba8186aac9d", 1, 0, 0.0, 2316.0, 2316, 2316, 2316.0, 2316.0, 2316.0, 2316.0, 0.4317789291882556, 0.07800693544905009, 0.2976913320379966], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 288.71428571428567, 127, 940, 234.5, 669.0, 940.0, 940.0, 0.09299297903008323, 0.18172421229964994, 0.06009904790134773], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 161.75000000000003, 126, 384, 131.0, 379.8, 384.0, 384.0, 0.08393090388337801, 0.062374431499268225, 0.04212937948833623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 194.49999999999997, 127, 389, 133.5, 386.9, 389.0, 389.0, 0.08393134416047673, 0.03033700073964497, 0.047426537123882666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 959.5, 786, 1024, 1014.0, 1024.0, 1024.0, 1024.0, 0.05894141223623718, 17.330732236531887, 0.033615024165979016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1176.5, 1131, 1243, 1166.0, 1243.0, 1243.0, 1243.0, 0.05880796259813578, 52.91550811917433, 0.033481486518274574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 320.75, 125, 393, 382.5, 393.0, 393.0, 393.0, 0.05949636328479421, 0.10528067409379603, 0.03294378709226399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 167.64285714285714, 127, 392, 131.0, 388.0, 392.0, 392.0, 0.08282994420811615, 0.06155623783435195, 0.04157674933883956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 205.57142857142856, 127, 396, 131.0, 395.0, 396.0, 396.0, 0.08282406394017737, 0.02216190773399277, 0.047235598965882405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 147.42857142857142, 124, 374, 129.0, 256.5, 374.0, 374.0, 0.08282700396977997, 0.02232446591372976, 0.048693219130671435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 183.7142857142857, 126, 389, 130.5, 385.5, 389.0, 389.0, 0.08282896410547677, 0.022324994231554287, 0.04877525913633056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a1e13b2-c31f-4d45-9593-5ccc5a33d382", 3, 0, 0.0, 369.0, 238, 530, 339.0, 530.0, 530.0, 530.0, 0.06942034015966679, 0.031410896100890894, 0.04451760094874464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ea6a14f-a309-43a0-a7bc-c5ab7973676b", 2, 0, 0.0, 603.5, 267, 940, 603.5, 940.0, 940.0, 940.0, 0.03065087125101531, 0.027088904767743022, 0.019052030811788325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 131.5, 129, 137, 130.0, 137.0, 137.0, 137.0, 0.059723777528928705, 0.04438456513624487, 0.03353630085852931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 848.4285714285713, 127, 2008, 403.0, 1857.6000000000001, 1996.7999999999997, 2008.0, 0.09735969772131946, 41.73013941850762, 0.05325263972275667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 272.625, 126, 1123, 134.0, 614.1000000000005, 1123.0, 1123.0, 0.08393178444219461, 4.74133129744113, 0.04889190373024324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 555.5238095238096, 127, 1183, 390.0, 1115.4, 1177.5, 1183.0, 0.09736105187025945, 13.645832367449882, 0.053348459551119186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 251.3125, 127, 1055, 132.5, 585.3000000000004, 1055.0, 1055.0, 0.0839287025671692, 1.5635716482285797, 0.04897207010144882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ece9498-32fb-43be-a861-19c4045e665c", 3, 0, 0.0, 702.6666666666667, 226, 1395, 487.0, 1395.0, 1395.0, 1395.0, 0.022854530910753054, 0.027013281815411575, 0.0146560631165962], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 581.2142857142858, 132, 2316, 484.0, 1578.0, 2316.0, 2316.0, 0.09109482971773616, 0.01868791114675377, 0.06141402966112723], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c10842a7-e07b-4eeb-a512-f1fb7460f389", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ece9498-32fb-43be-a861-19c4045e665c", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 374.85714285714283, 259, 789, 264.5, 783.5, 789.0, 789.0, 0.08275992527961032, 0.12826172013548984, 0.18612901163959236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cec066f-c470-4ab4-bf69-c321622c8c69", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28ea3a0d-9364-4e48-b59e-c9de37eff168", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 621.157894736842, 147, 1472, 591.0, 1082.0, 1472.0, 1472.0, 0.09411578222598685, 0.05781135451186107, 0.042554303877570226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 157.61904761904762, 127, 395, 133.0, 335.8000000000002, 393.9, 395.0, 0.09735789224799374, 0.07235288671945628, 0.04886909825729373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dd4f4e4-fb1e-4871-99e8-a9e266199c02", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 193.8095238095238, 126, 403, 132.0, 401.4, 402.9, 403.0, 0.09736014910011405, 0.09568496052277764, 0.05163202847552552], "isController": false}, {"data": ["login", 19, 0, 0.0, 3279.2631578947376, 2185, 5031, 3182.0, 4487.0, 5031.0, 5031.0, 0.0965138192550149, 24.44179732542428, 0.17931152470245806], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 173.0625, 129, 469, 138.5, 410.20000000000005, 469.0, 469.0, 0.08009411057993142, 0.06484181413160464, 0.02847095337021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f60833f8-8bfa-4e54-98cc-ac29d7e3593b", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 1008.3333333333334, 263, 2144, 798.0, 1997.8000000000002, 2133.3999999999996, 2144.0, 0.09729834917134239, 55.50882131882121, 0.2069716511414023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 596.4375, 260, 1950, 394.0, 1750.5000000000002, 1950.0, 1950.0, 0.0775960736386739, 11.70921151780345, 0.17203367790839783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 603.4, 127, 1373, 144.0, 1366.7, 1373.0, 1373.0, 0.09139765290827331, 43.75202074498227, 0.11877232102054619], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1478.1818181818185, 285, 3006, 1451.5, 2633.6, 2959.0499999999993, 3006.0, 0.08771685000817361, 0.0277385848481103, 0.03957537568728146], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/71b3b244-9f6b-4006-b254-e73b9d335cc2", 3, 0, 0.0, 415.0, 276, 489, 480.0, 489.0, 489.0, 489.0, 0.017770090568228262, 0.021003645460038026, 0.011395533339651587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 138.78571428571428, 130, 164, 136.0, 160.5, 164.0, 164.0, 0.06522154360758993, 0.050635866375033194, 0.023184220579260482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 484.68750000000006, 260, 1501, 512.0, 990.0000000000005, 1501.0, 1501.0, 0.0838723881614124, 6.393145144116352, 0.18728974568319304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a35e1cd4-77a5-4d96-868b-d5432309ceef", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 467.0, 263, 772, 517.0, 750.2, 772.0, 772.0, 0.0903876809807885, 0.14008325167628063, 0.20328401298706636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 134.5, 128, 145, 135.0, 145.0, 145.0, 145.0, 0.05319148936170213, 0.039530003324468085, 0.026699634308510637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c03e6fee-5ee3-4927-bd06-8acb31ae5f35", 3, 0, 0.0, 491.6666666666667, 258, 661, 556.0, 661.0, 661.0, 661.0, 0.06808433379479381, 0.030806388012618296, 0.04366085207543744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 162.625, 126, 385, 130.0, 385.0, 385.0, 385.0, 0.05310286689102628, 0.024178917664004883, 0.029727752387969545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 256.125, 127, 1131, 132.0, 1131.0, 1131.0, 1131.0, 0.05284155459853629, 5.955827608143545, 0.030497420671616163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 240.125, 127, 1004, 132.0, 1004.0, 1004.0, 1004.0, 0.05288591846313521, 1.956249607487324, 0.030574671611500043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 135.66666666666666, 132, 141, 134.0, 141.0, 141.0, 141.0, 0.053506456445744456, 0.01578022445958479, 0.0330757684864807], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1488.9272727272726, 1004, 2275, 1393.0, 2120.4, 2211.7999999999997, 2275.0, 0.25609625494149363, 306.3801543736584, 0.5056900659098634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1478.1818181818185, 285, 3006, 1451.5, 2633.6, 2959.0499999999993, 3006.0, 0.08691323688597774, 0.027484459320654533, 0.03921280804816574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 189.92307692307693, 127, 396, 129.0, 394.4, 396.0, 396.0, 0.06423527900346376, 0.017313415043902342, 0.03782604808504751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 213.23076923076923, 128, 404, 133.0, 402.4, 404.0, 404.0, 0.06423273992163606, 0.017312730682003466, 0.03776182561799307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 219.28571428571428, 127, 1121, 131.5, 750.0, 1121.0, 1121.0, 0.06596927716520591, 4.256458694102818, 0.03837777424370936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 192.7857142857143, 127, 1003, 130.0, 569.0, 1003.0, 1003.0, 0.06596927716520591, 1.4020220025209689, 0.038442197365941004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 132.50000000000003, 127, 141, 133.0, 139.5, 141.0, 141.0, 0.06596927716520591, 0.04902599601828291, 0.033113484827066254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 152.3076923076923, 127, 388, 132.0, 289.5999999999999, 388.0, 388.0, 0.06431981792543849, 0.01721057628083022, 0.036682396160601635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ec1f58a-9ace-435f-83ce-9ba8186aac9d", 3, 0, 0.0, 565.0, 234, 1007, 454.0, 1007.0, 1007.0, 1007.0, 0.0181312703976792, 0.024995419965550585, 0.011627149311011725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 204.14285714285714, 127, 397, 132.0, 396.0, 397.0, 397.0, 0.06596896631341856, 0.02472915910772261, 0.03722718592881948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 170.0, 128, 384, 132.0, 382.8, 384.0, 384.0, 0.06431886323830634, 0.04779946769956164, 0.032285054398915485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 203.9230769230769, 132, 898, 137.0, 624.7999999999997, 898.0, 898.0, 0.06519362506644734, 0.051314513480035705, 0.023174296410338704], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 591.3846153846154, 127, 1395, 530.0, 1268.6, 1395.0, 1395.0, 0.09379509379509379, 0.018826659451659452, 0.06382181186868686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1968.0000000000002, 1182, 3118, 1841.0, 2655.0, 3118.0, 3118.0, 0.0948790292377219, 0.04910731005468028, 0.04364064723727248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 385.6923076923077, 259, 785, 268.0, 779.0, 785.0, 785.0, 0.06419055707528072, 0.09948282624850634, 0.14436606732848778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ea6a14f-a309-43a0-a7bc-c5ab7973676b", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 1446.1896551724137, 675, 3611, 1118.0, 2500.4000000000005, 2811.2999999999997, 3611.0, 0.2597425861404939, 81.36875158840428, 0.9446500934289604], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 254.6727272727274, 128, 600, 138.0, 518.8, 540.5999999999999, 600.0, 0.25749907534422944, 0.19136405892281114, 0.1244746506790953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cec066f-c470-4ab4-bf69-c321622c8c69", 3, 0, 0.0, 681.6666666666666, 398, 1192, 455.0, 1192.0, 1192.0, 1192.0, 0.024983136382941515, 0.029529221421373906, 0.016021086808071218], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 813.6000000000001, 630, 1168, 762.0, 1047.8, 1075.3999999999996, 1168.0, 0.25695051133151753, 75.55198189141271, 0.12922804036692534], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 202.509090909091, 125, 518, 135.0, 396.2, 402.2, 518.0, 0.2576981464475139, 0.4560049232059524, 0.12532585637779486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd2c4fa-9761-4656-afa5-86a35c7a1ff2", 3, 0, 0.0, 664.6666666666666, 235, 1075, 684.0, 1075.0, 1075.0, 1075.0, 0.025041318174988732, 0.025114681411829518, 0.01605839739737233], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1230.563636363636, 875, 1756, 1175.0, 1562.2, 1665.3999999999999, 1756.0, 0.2567489975118688, 231.02319927777674, 0.12887596164169976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 139.8181818181818, 130, 172, 138.0, 166.00000000000003, 172.0, 172.0, 0.08938365904196968, 0.06677587809287774, 0.031773097550075166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, 3.508771929824561, 246.86549707602327, 128, 2202, 145.0, 434.6000000000002, 524.0, 1823.2800000000007, 0.7195697730199208, 1.5467355767814612, 0.3463184314536151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 170.625, 131, 409, 136.0, 409.0, 409.0, 409.0, 0.05047286767906827, 0.039086898505372204, 0.0179415271827938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a1e13b2-c31f-4d45-9593-5ccc5a33d382", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd2c4fa-9761-4656-afa5-86a35c7a1ff2", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0321018b-66d4-4a07-ba40-ba71badcb2e9", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 137.37499999999997, 130, 150, 136.0, 147.9, 150.0, 150.0, 0.07775634078660258, 0.06310109296256519, 0.027639949263987638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dd4f4e4-fb1e-4871-99e8-a9e266199c02", 3, 0, 0.0, 454.6666666666667, 362, 634, 368.0, 634.0, 634.0, 634.0, 0.02225816503687436, 0.02630839754195664, 0.014273627969610184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 392.5, 257, 1259, 270.0, 1259.0, 1259.0, 1259.0, 0.05279447769763283, 7.966662194946908, 0.11704752245415129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 390.85714285714283, 260, 1249, 268.5, 886.5, 1249.0, 1249.0, 0.06592702819793178, 5.728564849533331, 0.14706657099399123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28ea3a0d-9364-4e48-b59e-c9de37eff168", 3, 0, 0.0, 537.0, 228, 1079, 304.0, 1079.0, 1079.0, 1079.0, 0.018116926644564015, 0.02497564594392207, 0.011617951005791377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 137.28571428571428, 132, 145, 136.5, 144.0, 145.0, 145.0, 0.08308358802409424, 0.06888473264888283, 0.02953361918043975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 138.47619047619048, 132, 188, 135.0, 142.8, 183.49999999999994, 188.0, 0.10163388570543597, 0.07890521399982577, 0.03612767030935419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71b3b244-9f6b-4006-b254-e73b9d335cc2", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 155.63636363636363, 129, 379, 133.0, 332.00000000000017, 379.0, 379.0, 0.09068051605457318, 0.06739050070071308, 0.04551736841020568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 199.9090909090909, 126, 390, 131.0, 388.0, 390.0, 390.0, 0.09068350631899161, 0.024264922589261422, 0.0517179371975499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 238.72727272727275, 128, 533, 135.0, 504.60000000000014, 533.0, 533.0, 0.09049178170091644, 0.02439036303657513, 0.053199270101515324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 273.45454545454544, 127, 398, 381.0, 397.2, 398.0, 398.0, 0.09048433798367991, 0.024388356722163728, 0.05328325762124901], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.3924646781789639], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.23547880690737832], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 13.043478260869565, 0.23547880690737832], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.9419152276295133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 23, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

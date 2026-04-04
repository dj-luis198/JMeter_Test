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

    var data = {"OkPercent": 98.2496194824962, "KoPercent": 1.7503805175038052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7803524804177546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dc705d6-fb12-46ae-ade9-79ce38921cd6"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ba5e3c3-058b-4405-b287-545d67cd6a2f"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176a9b98-e4ea-43a6-96f8-cf98e4577c19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e22c5df-8bfc-4c73-8a82-bcbc4332c398"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69d992a3-bbd1-4322-9dbf-779945594bbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59fdd763-1212-4899-8361-274c81c6d8bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d12b0293-8330-4f76-b3cc-c919b779846a"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53ac3e24-8a68-402e-a782-a3d1023a3c79"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/785e998e-bf77-4ea6-8445-be0dfd80a48c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9de77e53-52bb-47fb-9bff-21efe3b84757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb3edc6-0388-4f50-8e36-60ddeb116d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/feb000c2-cdb2-489a-92ed-e6f33b8040c0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/176a9b98-e4ea-43a6-96f8-cf98e4577c19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af3a495f-8243-4d75-994d-aa37f2aa2b1f"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7eab8fa-a3ce-47d9-adf3-92b67e1400a3"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7eab8fa-a3ce-47d9-adf3-92b67e1400a3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dc705d6-fb12-46ae-ade9-79ce38921cd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7995e72-3282-4dcc-88ea-c16506690ff9"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb22f93d-ae52-4305-967b-e4c961664082"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53ac3e24-8a68-402e-a782-a3d1023a3c79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d12b0293-8330-4f76-b3cc-c919b779846a"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59fdd763-1212-4899-8361-274c81c6d8bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ba5e3c3-058b-4405-b287-545d67cd6a2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d992a3-bbd1-4322-9dbf-779945594bbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=feb000c2-cdb2-489a-92ed-e6f33b8040c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81b9e2d2-fe23-411e-a1a2-1ba86b19d554"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdb3edc6-0388-4f50-8e36-60ddeb116d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=785e998e-bf77-4ea6-8445-be0dfd80a48c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9de77e53-52bb-47fb-9bff-21efe3b84757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af3a495f-8243-4d75-994d-aa37f2aa2b1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 23, 1.7503805175038052, 361.7678843226783, 97, 2115, 115.5, 1012.0, 1222.25, 1597.249999999996, 5.2407180661191965, 766.8395365364596, 3.8227707691870503], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dc705d6-fb12-46ae-ade9-79ce38921cd6", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1675.9649122807016, 1245, 2191, 1650.0, 2026.4, 2073.5999999999995, 2191.0, 0.24971195506937174, 300.48860168971754, 1.2278317322014518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3ba5e3c3-058b-4405-b287-545d67cd6a2f", 3, 0, 0.0, 316.6666666666667, 197, 508, 245.0, 508.0, 508.0, 508.0, 0.031644902006286786, 0.026072020500622347, 0.02029311749752115], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 605.5714285714286, 108, 1269, 461.0, 1260.0, 1269.0, 1269.0, 0.07605554227601642, 0.014361213235294119, 0.05143404592396619], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 605.5714285714286, 108, 1269, 461.0, 1260.0, 1269.0, 1269.0, 0.07509641843724353, 0.014180106355302612, 0.050785419695108545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176a9b98-e4ea-43a6-96f8-cf98e4577c19", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 101.65217391304347, 98, 105, 101.0, 104.0, 104.8, 105.0, 0.11274896687631439, 0.037531925115077476, 0.06389044293186531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 121.17391304347824, 100, 308, 102.0, 229.20000000000027, 307.6, 308.0, 0.11274620339415092, 0.08378892654584849, 0.056593309125579666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 195.34782608695653, 99, 819, 105.0, 308.0, 717.1999999999986, 819.0, 0.11263687829340438, 1.468994939298517, 0.06590730382818469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 180.86956521739128, 98, 1205, 103.0, 365.0000000000001, 1044.1999999999978, 1205.0, 0.11274841416904419, 4.439990614000902, 0.06586246102826554], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 232.39999999999998, 101, 416, 208.0, 357.20000000000005, 416.0, 416.0, 0.07395136957936461, 0.12671875308130706, 0.04780359040061922], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 130.06666666666666, 100, 304, 103.0, 301.6, 304.0, 304.0, 0.08604371020478403, 0.06394459322836, 0.04318990922388573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 143.60000000000002, 100, 316, 104.0, 304.6, 316.0, 316.0, 0.08604420377561967, 0.048870418863183974, 0.04762681123048947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 737.5, 587, 901, 755.0, 901.0, 901.0, 901.0, 0.05929263881889064, 17.43400451365213, 0.033815333076398564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1205.1666666666667, 1045, 1495, 1143.5, 1495.0, 1495.0, 1495.0, 0.0588939712204794, 52.99289882874615, 0.03353045431790966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.83333333333334, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.05970921611750774, 0.10565732383293362, 0.03306164603381532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.92307692307693, 101, 113, 103.0, 111.0, 113.0, 113.0, 0.06577050142418432, 0.04887827303105885, 0.03301370872268627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 132.76923076923077, 99, 303, 102.0, 302.6, 303.0, 303.0, 0.06570534689896035, 0.01758131352569837, 0.03747258065331332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 133.3076923076923, 100, 303, 103.0, 302.2, 303.0, 303.0, 0.06570534689896035, 0.017709644281360404, 0.038627557454271606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 117.46153846153844, 99, 303, 102.0, 226.19999999999993, 303.0, 303.0, 0.0657724979888794, 0.017727743598565146, 0.03873126590556081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 170.5, 100, 311, 104.0, 311.0, 311.0, 311.0, 0.05971159300578207, 0.04437551003652359, 0.033529458963207706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 717.2105263157895, 98, 1506, 1114.0, 1367.0, 1506.0, 1506.0, 0.10129929676961874, 47.98624120628802, 0.054971113039352114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 355.73333333333335, 99, 1241, 105.0, 1196.6000000000001, 1241.0, 1241.0, 0.08604568452210228, 15.503365237758567, 0.0491065410495279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e22c5df-8bfc-4c73-8a82-bcbc4332c398", 2, 0, 0.0, 221.5, 202, 241, 221.5, 241.0, 241.0, 241.0, 0.01543305142292734, 0.03033107030140749, 0.009592907451848879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 463.2631578947368, 99, 817, 586.0, 812.0, 817.0, 817.0, 0.10129875669104946, 15.68935303416434, 0.055069744527201384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 228.13333333333333, 97, 788, 104.0, 678.2, 788.0, 788.0, 0.08604469735211784, 5.078552982739434, 0.04919000569329081], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 401.7857142857143, 104, 698, 404.5, 621.0, 698.0, 698.0, 0.07544932769259788, 0.014246744563606478, 0.05163458105413489], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/69d992a3-bbd1-4322-9dbf-779945594bbc", 3, 0, 0.0, 575.3333333333334, 209, 1003, 514.0, 1003.0, 1003.0, 1003.0, 0.04697997087241806, 0.030203594555021376, 0.03012712975867955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59fdd763-1212-4899-8361-274c81c6d8bc", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 254.9230769230769, 203, 412, 209.0, 409.2, 412.0, 412.0, 0.06566983228935139, 0.10177541390937563, 0.14769299195544555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d12b0293-8330-4f76-b3cc-c919b779846a", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 554.2608695652174, 198, 1279, 510.0, 947.4000000000001, 1217.799999999999, 1279.0, 0.10065425264217413, 0.061827661046804226, 0.04551066305988928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 106.78947368421052, 100, 164, 103.0, 114.0, 164.0, 164.0, 0.10129335622207768, 0.0752775821142589, 0.05084451669741009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 133.89473684210532, 99, 310, 103.0, 301.0, 310.0, 310.0, 0.10130037694403421, 0.10718387951119902, 0.05329516130752129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53ac3e24-8a68-402e-a782-a3d1023a3c79", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["login", 23, 0, 0.0, 2465.6956521739125, 1567, 3605, 2448.0, 3375.6, 3565.9999999999995, 3605.0, 0.09691678219428022, 30.379394965383852, 0.1881507316690334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 108.6, 104, 122, 107.0, 120.8, 122.0, 122.0, 0.08336297350168949, 0.06748818850869198, 0.029632931986928686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/785e998e-bf77-4ea6-8445-be0dfd80a48c", 3, 0, 0.0, 587.6666666666666, 266, 903, 594.0, 903.0, 903.0, 903.0, 0.0770574334737491, 0.034866481942874755, 0.04941508591903832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9de77e53-52bb-47fb-9bff-21efe3b84757", 3, 0, 0.0, 439.3333333333333, 212, 624, 482.0, 624.0, 624.0, 624.0, 0.040931044833137774, 0.02679437863263023, 0.026248098411875462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb3edc6-0388-4f50-8e36-60ddeb116d2b", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/feb000c2-cdb2-489a-92ed-e6f33b8040c0", 3, 0, 0.0, 306.0, 196, 444, 278.0, 444.0, 444.0, 444.0, 0.04325197156903736, 0.028088438567783047, 0.02773645312207148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176a9b98-e4ea-43a6-96f8-cf98e4577c19", 3, 0, 0.0, 758.3333333333334, 275, 1080, 920.0, 1080.0, 1080.0, 1080.0, 0.02477393781741608, 0.02484651771336554, 0.015886932780048723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af3a495f-8243-4d75-994d-aa37f2aa2b1f", 3, 0, 0.0, 393.66666666666663, 185, 680, 316.0, 680.0, 680.0, 680.0, 0.023551577955723033, 0.023620576719265193, 0.015103062686449993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 836.473684210526, 204, 1611, 1219.0, 1470.0, 1611.0, 1611.0, 0.10123614663256607, 63.81833335830935, 0.21404972060155583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7eab8fa-a3ce-47d9-adf3-92b67e1400a3", 3, 0, 0.0, 339.3333333333333, 195, 550, 273.0, 550.0, 550.0, 550.0, 0.04391422088853107, 0.02823261271316695, 0.028161137744272854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 339.30434782608694, 203, 1312, 211.0, 671.8000000000002, 1190.9999999999982, 1312.0, 0.11257953989231523, 6.022728141825746, 0.2519416529001468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1057.375, 100, 1807, 1248.0, 1807.0, 1807.0, 1807.0, 0.07844752350974221, 70.39313087743555, 0.1456622656380235], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 943.2083333333333, 228, 1874, 944.5, 1469.5, 1810.5, 1874.0, 0.09530541414173503, 0.02992254945953888, 0.04299912239597811], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.42857142857143, 100, 305, 105.0, 213.5, 305.0, 305.0, 0.07390280725092115, 0.05737571461375226, 0.026270138514975876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 501.13333333333327, 204, 1472, 219.0, 1395.8, 1472.0, 1472.0, 0.08599191675982457, 20.681862154957432, 0.1889974686129504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7eab8fa-a3ce-47d9-adf3-92b67e1400a3", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 383.43749999999994, 205, 1205, 211.5, 789.2000000000004, 1205.0, 1205.0, 0.10588383220059691, 8.07096021125479, 0.23644200957586906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 102.2, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.07709981341845154, 0.05729781055804845, 0.03870049228230868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 142.2, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.07709743573928732, 0.02062958729742649, 0.0439696313200623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 142.8, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.07709624695469824, 0.020779847812008513, 0.045324160807351896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 102.0, 98, 105, 103.0, 105.0, 105.0, 105.0, 0.07709268082088286, 0.020778886627503584, 0.04539735013182848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1137.578947368421, 808, 1724, 1037.0, 1604.6, 1630.6, 1724.0, 0.2599048839319505, 310.93659873991726, 0.5132106204203163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 943.2083333333333, 228, 1874, 944.5, 1469.5, 1810.5, 1874.0, 0.09685894512537178, 0.03041030357207718, 0.04370003188273611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dc705d6-fb12-46ae-ade9-79ce38921cd6", 3, 0, 0.0, 346.6666666666667, 224, 416, 400.0, 416.0, 416.0, 416.0, 0.044883974924819346, 0.028856071118658268, 0.028783017774054072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 170.33333333333334, 102, 302, 105.0, 302.0, 302.0, 302.0, 0.04579104021979699, 0.01234211630924216, 0.026964841066931238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 125.0, 99, 295, 103.0, 295.0, 295.0, 295.0, 0.0458362829830253, 0.012354310647768537, 0.026946721050567606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7995e72-3282-4dcc-88ea-c16506690ff9", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 264.7857142857142, 101, 1096, 104.0, 1037.0, 1096.0, 1096.0, 0.07689688128220057, 9.902329374745966, 0.04426290906394525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 230.92857142857142, 101, 824, 104.0, 705.5, 824.0, 824.0, 0.07689814840244097, 3.2478525162172702, 0.044338734283940924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 134.2857142857143, 100, 307, 103.5, 301.5, 307.0, 307.0, 0.07689519185350369, 0.05714574316456669, 0.03859778184834071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 125.33333333333333, 100, 304, 101.0, 304.0, 304.0, 304.0, 0.04583488238259904, 0.012264411887531385, 0.026140206358826017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.42857142857142, 99, 305, 103.0, 304.5, 305.0, 305.0, 0.0768985707851344, 0.037076096628546946, 0.042933604950070856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 106.44444444444444, 102, 127, 104.0, 127.0, 127.0, 127.0, 0.04583674986885597, 0.03406422524433534, 0.023007899836515595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 151.88888888888889, 102, 317, 108.0, 317.0, 317.0, 317.0, 0.048966800509254726, 0.038542227744589166, 0.017406167368524142], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 522.5714285714286, 100, 920, 511.0, 808.5, 920.0, 920.0, 0.07611467219041716, 0.01422371699205689, 0.0518032126508022], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eb22f93d-ae52-4305-967b-e4c961664082", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1213.3478260869565, 817, 2115, 1174.0, 1830.8000000000004, 2084.3999999999996, 2115.0, 0.09768735798169424, 0.05056083958036909, 0.04493236875915819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 278.0, 206, 407, 221.0, 407.0, 407.0, 407.0, 0.04576659038901602, 0.07092927631578948, 0.10293013443935926], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 1111.9298245614034, 515, 2540, 858.0, 1915.0, 2025.9999999999993, 2540.0, 0.2678609190919045, 96.66324448887907, 0.9696420253222555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/53ac3e24-8a68-402e-a782-a3d1023a3c79", 3, 0, 0.0, 332.0, 183, 455, 358.0, 455.0, 455.0, 455.0, 0.019694990250979826, 0.027151134021126157, 0.012629925388811932], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 176.03508771929822, 100, 429, 106.0, 413.6, 426.0, 429.0, 0.2609854260243678, 0.1939549894575624, 0.12615994715045123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d12b0293-8330-4f76-b3cc-c919b779846a", 3, 0, 0.0, 328.0, 208, 411, 365.0, 411.0, 411.0, 411.0, 0.06233507178922434, 0.028204996675462838, 0.03997398809400129], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 649.6140350877193, 490, 1037, 602.0, 840.2000000000002, 919.1, 1037.0, 0.2608098833218943, 76.6867653997941, 0.13116903311599176], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 130.33333333333334, 99, 313, 104.0, 304.2, 306.5, 313.0, 0.26139474734134027, 0.462546174006356, 0.12712361735936276], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 960.1929824561404, 701, 1307, 924.0, 1217.2, 1298.3, 1307.0, 0.2604357043643541, 234.3405045841824, 0.13072651566726368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 122.37500000000001, 101, 298, 107.0, 184.6000000000001, 298.0, 298.0, 0.11032352373334804, 0.0824194293515735, 0.03921656507708857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, 7.017543859649122, 174.92982456140362, 100, 1414, 108.0, 311.0, 386.0000000000001, 1064.0800000000006, 0.7092110338306106, 1.617101926793661, 0.33797528285492695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 106.8, 103, 111, 105.0, 111.0, 111.0, 111.0, 0.09645433851614645, 0.0746955961360392, 0.03428650314441144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59fdd763-1212-4899-8361-274c81c6d8bc", 3, 0, 0.0, 309.3333333333333, 192, 419, 317.0, 419.0, 419.0, 419.0, 0.04120765913024367, 0.026492554291090903, 0.026425484533391937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ba5e3c3-058b-4405-b287-545d67cd6a2f", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d992a3-bbd1-4322-9dbf-779945594bbc", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 120.95652173913044, 103, 430, 106.0, 121.00000000000001, 368.99999999999915, 430.0, 0.11118953464762586, 0.09023291337126668, 0.03952440489427325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=feb000c2-cdb2-489a-92ed-e6f33b8040c0", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 246.6, 203, 409, 208.0, 409.0, 409.0, 409.0, 0.07697399818341365, 0.11929466320027096, 0.17311632599257973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81b9e2d2-fe23-411e-a1a2-1ba86b19d554", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 429.0, 205, 1197, 226.0, 1138.0, 1197.0, 1197.0, 0.07685087088504756, 13.236426043387807, 0.17003040755663634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb3edc6-0388-4f50-8e36-60ddeb116d2b", 3, 0, 0.0, 637.3333333333334, 318, 897, 697.0, 897.0, 897.0, 897.0, 0.06225616336017266, 0.028169292666223957, 0.03992338600896488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=785e998e-bf77-4ea6-8445-be0dfd80a48c", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9de77e53-52bb-47fb-9bff-21efe3b84757", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 136.76923076923077, 103, 306, 105.0, 306.0, 306.0, 306.0, 0.06477781210448162, 0.05370738523115713, 0.023026487896514954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 106.1578947368421, 101, 117, 106.0, 110.0, 117.0, 117.0, 0.09872745506601749, 0.07664875661863663, 0.035094525042998405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af3a495f-8243-4d75-994d-aa37f2aa2b1f", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 140.75, 99, 309, 104.0, 305.5, 309.0, 309.0, 0.10666453337599915, 0.07926924794837438, 0.05354059585474958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 139.6875, 98, 304, 102.5, 304.0, 304.0, 304.0, 0.10652250620826482, 0.03850258067415431, 0.060191977690192605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 215.75, 100, 1105, 104.5, 550.6000000000006, 1105.0, 1105.0, 0.10595745808058064, 5.985568107881249, 0.061722288813541366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 207.56249999999997, 102, 585, 107.0, 389.0000000000002, 585.0, 585.0, 0.10632359586401212, 1.980783152195582, 0.062039402860104724], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.532724505327245], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.076103500761035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.06544901065449], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 23, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.48858447488584, "KoPercent": 2.5114155251141552};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.779016393442623, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2807017543859649, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54a4e4e5-8bbf-4d25-a24c-0a400d594617"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa225dcf-fa7b-4400-bfd3-4c7be0952d30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acd35cd4-d115-473a-b8ad-8fe8dfb865c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78529026-1ba1-4e4f-87a0-73d0fa7b817a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56a55a8b-f363-42eb-9dd9-a3d76c6a5a8c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca3ed869-9b02-4772-a909-931b6f7d0af8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d0af5b98-6633-49b9-b9fc-5ab3a015133b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc8c7ca2-28a7-4043-8fa6-a5bf4923aee8"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ff904862-6a44-47d8-8693-af68745a1399"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d69b5138-e7af-4784-a544-02fa4a920b9f"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa225dcf-fa7b-4400-bfd3-4c7be0952d30"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78529026-1ba1-4e4f-87a0-73d0fa7b817a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cbe12b3-00b3-4325-972a-148b88587cd5"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0decad51-9bb7-4de2-bea0-d7beb3119d08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6754385964912281, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8959537572254336, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cbe12b3-00b3-4325-972a-148b88587cd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ca3ed869-9b02-4772-a909-931b6f7d0af8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56a55a8b-f363-42eb-9dd9-a3d76c6a5a8c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0decad51-9bb7-4de2-bea0-d7beb3119d08"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc8c7ca2-28a7-4043-8fa6-a5bf4923aee8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff904862-6a44-47d8-8693-af68745a1399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/220abbdb-8d73-4168-9186-9c1adaedcb07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3bbec6a-c91f-4e7b-9125-ad8b06aecf55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acd35cd4-d115-473a-b8ad-8fe8dfb865c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d69b5138-e7af-4784-a544-02fa4a920b9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0af5b98-6633-49b9-b9fc-5ab3a015133b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 33, 2.5114155251141552, 338.45129375951325, 85, 2828, 103.0, 941.0, 1172.0, 1830.849999999998, 5.14100597827788, 724.1594353439759, 3.7696568774648656], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1485.4035087719303, 1052, 1984, 1448.0, 1780.8000000000002, 1872.0999999999995, 1984.0, 0.2545176889793841, 306.27011617672014, 1.2514614882921864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/54a4e4e5-8bbf-4d25-a24c-0a400d594617", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 609.7692307692308, 88, 1537, 512.0, 1372.9999999999998, 1537.0, 1537.0, 0.07580749561191227, 0.01502824375900214, 0.05096732915614595], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 609.7692307692308, 88, 1537, 512.0, 1372.9999999999998, 1537.0, 1537.0, 0.07397544015386892, 0.01466505307737831, 0.049735591149123105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa225dcf-fa7b-4400-bfd3-4c7be0952d30", 3, 0, 0.0, 342.3333333333333, 188, 569, 270.0, 569.0, 569.0, 569.0, 0.07865551506253113, 0.03697218872079914, 0.05043989735455284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd35cd4-d115-473a-b8ad-8fe8dfb865c8", 3, 0, 0.0, 296.0, 180, 431, 277.0, 431.0, 431.0, 431.0, 0.04572613095963907, 0.02939749630380441, 0.02932307226252896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 137.42857142857142, 86, 265, 88.0, 265.0, 265.0, 265.0, 0.15629360870778677, 0.05858829891152665, 0.08819861149874407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78529026-1ba1-4e4f-87a0-73d0fa7b817a", 1, 0, 0.0, 1782.0, 1782, 1782, 1782.0, 1782.0, 1782.0, 1782.0, 0.5611672278338945, 0.10138275112233446, 0.38689849887766553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 90.35714285714285, 86, 101, 90.0, 97.5, 101.0, 101.0, 0.15660305599677846, 0.11638176329448087, 0.07860739334213293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 157.1428571428571, 86, 516, 90.5, 397.5, 516.0, 516.0, 0.15585687885467459, 3.3123718007592458, 0.09082229115178234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 205.07142857142856, 86, 1022, 90.5, 647.5, 1022.0, 1022.0, 0.15498383739981403, 9.999841297242396, 0.09016219335340743], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 296.38461538461536, 87, 628, 224.0, 571.1999999999999, 628.0, 628.0, 0.07611419471181995, 0.14609328343462377, 0.04919520217101103], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 131.95000000000002, 87, 265, 90.5, 259.9, 264.75, 265.0, 0.1157085994631121, 0.0859904728431917, 0.05808029308988243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 149.95000000000002, 86, 269, 90.5, 265.9, 268.85, 269.0, 0.11570793004298549, 0.03096091096853323, 0.06598967885264016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 655.2857142857142, 462, 799, 675.0, 799.0, 799.0, 799.0, 0.044835581517492284, 13.183149647560304, 0.025570292584194815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 912.7142857142858, 713, 1130, 930.0, 1130.0, 1130.0, 1130.0, 0.04472872031131189, 40.246981160822116, 0.02546566791161605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 160.7142857142857, 86, 260, 90.0, 260.0, 260.0, 260.0, 0.04500507914464632, 0.07963789395517494, 0.024919804565443814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 90.15384615384617, 86, 98, 90.0, 96.4, 98.0, 98.0, 0.0632295719844358, 0.046989945586089495, 0.03173828125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 102.07692307692307, 86, 255, 90.0, 191.39999999999995, 255.0, 255.0, 0.06323141725925853, 0.024224776744457523, 0.03565317142037219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 185.84615384615384, 87, 839, 91.0, 606.5999999999998, 839.0, 839.0, 0.06323110970597533, 4.3923059063328385, 0.036754982489846544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 150.07692307692307, 85, 710, 89.0, 529.5999999999999, 710.0, 710.0, 0.06323110970597533, 1.4458891418808824, 0.036816731620418784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 116.28571428571429, 88, 265, 91.0, 265.0, 265.0, 265.0, 0.04500189650849572, 0.03344379222945824, 0.02526961962146976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 583.8421052631578, 85, 1125, 761.0, 1117.0, 1125.0, 1125.0, 0.10808289389104106, 51.19968234650807, 0.05865230230785422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 148.65, 85, 267, 91.5, 260.7, 266.7, 267.0, 0.11570793004298549, 0.031186903019398436, 0.06802360731042703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 406.31578947368416, 85, 801, 511.0, 800.0, 801.0, 801.0, 0.10808350873200978, 16.740188932817567, 0.05875818625917288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 116.0, 86, 271, 90.0, 268.3, 270.9, 271.0, 0.11570659122596919, 0.03118654216637451, 0.06813581495044865], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 582.5384615384617, 91, 1782, 488.0, 1475.9999999999998, 1782.0, 1782.0, 0.07444097689466601, 0.01475734209923555, 0.050507129155094914], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 277.61538461538464, 173, 927, 185.0, 697.3999999999999, 927.0, 927.0, 0.06320221304979849, 5.906710191113769, 0.14089934470243912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 837.047619047619, 126, 2164, 846.0, 1573.2000000000003, 2109.0999999999995, 2164.0, 0.09251345850551115, 0.05682711464840481, 0.041829815710987955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 90.47368421052632, 87, 106, 89.0, 100.0, 106.0, 106.0, 0.10807920499212159, 0.08032058105371537, 0.054250694693311036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 127.42105263157895, 86, 270, 90.0, 269.0, 270.0, 270.0, 0.10808043459711596, 0.11435772135157428, 0.0568622187775534], "isController": false}, {"data": ["login", 21, 0, 0.0, 3287.428571428571, 1889, 5833, 3090.0, 4942.4, 5745.699999999999, 5833.0, 0.0877992491073743, 35.13087461248129, 0.1810002098297531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 110.85, 88, 270, 93.5, 149.5, 263.9999999999999, 270.0, 0.11693239553552114, 0.09466499599506546, 0.041565812475517286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56a55a8b-f363-42eb-9dd9-a3d76c6a5a8c", 3, 0, 0.0, 480.0, 441, 513, 486.0, 513.0, 513.0, 513.0, 0.030178354072568882, 0.02515845207677373, 0.019352655443672102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca3ed869-9b02-4772-a909-931b6f7d0af8", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0af5b98-6633-49b9-b9fc-5ab3a015133b", 3, 0, 0.0, 1066.0, 292, 2352, 554.0, 2352.0, 2352.0, 2352.0, 0.07671849427168576, 0.03471312078048282, 0.04919773232917349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc8c7ca2-28a7-4043-8fa6-a5bf4923aee8", 3, 0, 0.0, 326.3333333333333, 183, 572, 224.0, 572.0, 572.0, 572.0, 0.03140473374019911, 0.031496739796078595, 0.020139103342510494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 676.7894736842105, 175, 1215, 850.0, 1210.0, 1215.0, 1215.0, 0.10802390170962037, 68.09727157031219, 0.22840148255698262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff904862-6a44-47d8-8693-af68745a1399", 3, 0, 0.0, 891.6666666666666, 212, 1864, 599.0, 1864.0, 1864.0, 1864.0, 0.026433814135041544, 0.031243873412869744, 0.016951371694671823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d69b5138-e7af-4784-a544-02fa4a920b9f", 3, 0, 0.0, 445.0, 299, 561, 475.0, 561.0, 561.0, 561.0, 0.02179250628350598, 0.025758004659964258, 0.013975012167482674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 686.9090909090909, 86, 1227, 869.0, 1220.6, 1227.0, 1227.0, 0.07024445068839562, 53.48478828482209, 0.11772056957074255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 346.2857142857143, 179, 1124, 348.0, 746.5, 1124.0, 1124.0, 0.15483128919167005, 13.453679092108027, 0.34538955275876176], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1200.5652173913045, 410, 1919, 1203.0, 1862.8000000000002, 1914.3999999999999, 1919.0, 0.09344389506656861, 0.02901077448737898, 0.042159257344487014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 96.06666666666666, 89, 114, 94.0, 109.8, 114.0, 114.0, 0.08079328230788704, 0.06272525335426778, 0.028719487070381723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 318.15, 176, 531, 344.0, 529.7, 530.95, 531.0, 0.11564704521799468, 0.1792303327743726, 0.26009291517289235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa225dcf-fa7b-4400-bfd3-4c7be0952d30", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 323.3684210526316, 176, 1300, 210.0, 529.0, 1300.0, 1300.0, 0.0826622464118059, 5.326251095818596, 0.18479617638165594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.88888888888889, 87, 264, 89.0, 264.0, 264.0, 264.0, 0.04783239528691465, 0.035547317200529345, 0.02400962029050208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 107.33333333333333, 86, 256, 88.0, 256.0, 256.0, 256.0, 0.04783290372299434, 0.012799038691504346, 0.027279702904520208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 128.77777777777777, 86, 277, 90.0, 277.0, 277.0, 277.0, 0.04783341216988302, 0.012892599373913783, 0.028120814576435137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 107.33333333333333, 85, 267, 87.0, 267.0, 267.0, 267.0, 0.04783214107292807, 0.012892256773562646, 0.028166778385718388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 93.5, 91, 96, 93.5, 96.0, 96.0, 96.0, 0.041425878746452906, 0.012217397833426541, 0.025607989498539735], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1021.8947368421053, 677, 1584, 949.0, 1395.2, 1482.4999999999995, 1584.0, 0.2390277859317471, 285.96033147807236, 0.4719865069863209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1200.5652173913045, 410, 1919, 1203.0, 1862.8000000000002, 1914.3999999999999, 1919.0, 0.09059897741328102, 0.028127535786596075, 0.04087571051263265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 117.66666666666666, 87, 257, 89.0, 257.0, 257.0, 257.0, 0.03521664103677791, 0.009491985279444047, 0.020737924360524494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 118.5, 87, 254, 90.5, 254.0, 254.0, 254.0, 0.035216227637695455, 0.009491873855472602, 0.02070329007606705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 112.06666666666666, 85, 271, 88.0, 262.0, 271.0, 271.0, 0.08226931683559299, 0.022174151803343426, 0.04836536009279979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 87.93333333333332, 86, 92, 87.0, 91.4, 92.0, 92.0, 0.082345643092024, 0.022194724114647096, 0.04849064725047898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 91.0, 87, 99, 91.0, 98.4, 99.0, 99.0, 0.08234293085938572, 0.06119430701561771, 0.0413322914665276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 88.16666666666667, 88, 89, 88.0, 89.0, 89.0, 89.0, 0.035216227637695455, 0.009423092160867728, 0.020084254824623185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 100.26666666666667, 86, 267, 88.0, 161.40000000000006, 267.0, 267.0, 0.082345643092024, 0.022033892780482987, 0.04696274957591994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 91.16666666666666, 88, 103, 89.0, 103.0, 103.0, 103.0, 0.03521312745391482, 0.02616913085198162, 0.017675339366515837], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 493.15384615384625, 86, 816, 554.0, 756.4, 816.0, 816.0, 0.07480894945216832, 0.014515588674500505, 0.05090852412013166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 93.66666666666667, 88, 100, 94.0, 100.0, 100.0, 100.0, 0.036040365209034114, 0.02836770933445459, 0.012811223570398848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1692.6666666666667, 1128, 2752, 1559.0, 2520.2000000000003, 2733.1, 2752.0, 0.08998508818538642, 0.04657431322095195, 0.04138962552277051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 211.16666666666666, 177, 348, 184.0, 348.0, 348.0, 348.0, 0.035194744251525106, 0.05454497961637729, 0.07915380469849836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78529026-1ba1-4e4f-87a0-73d0fa7b817a", 3, 0, 0.0, 445.66666666666663, 186, 816, 335.0, 816.0, 816.0, 816.0, 0.020774903916069388, 0.024555233111734357, 0.013322448149302309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cbe12b3-00b3-4325-972a-148b88587cd5", 3, 0, 0.0, 432.0, 309, 512, 475.0, 512.0, 512.0, 512.0, 0.03856933480753902, 0.02479636596513332, 0.02473359035509501], "isController": false}, {"data": ["addBook", 58, 16, 27.586206896551722, 947.5000000000001, 455, 3344, 766.0, 1697.2, 2153.5499999999993, 3344.0, 0.28586496330578187, 77.77476343750153, 1.040443153842173], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0decad51-9bb7-4de2-bea0-d7beb3119d08", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 164.0877192982456, 86, 473, 93.0, 361.2, 365.2, 473.0, 0.2396528817207918, 0.1781014091694556, 0.11584782856620306], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 545.0701754385963, 423, 865, 513.0, 714.6, 777.8, 865.0, 0.2396287016328384, 70.45879470178839, 0.12051638802823415], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 134.75438596491233, 86, 273, 93.0, 261.2, 268.29999999999995, 273.0, 0.23979604715147537, 0.42432659906100917, 0.11661956199358861], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 856.3157894736844, 590, 1159, 846.0, 1094.2, 1114.1999999999998, 1159.0, 0.23942940193055706, 215.43899672911084, 0.12018233651592415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 97.26315789473684, 89, 135, 93.0, 115.0, 135.0, 135.0, 0.0869831939313199, 0.06498256187251926, 0.030919807217773872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 16, 9.248554913294798, 167.57803468208093, 87, 2828, 95.0, 307.39999999999975, 392.9999999999993, 1513.0199999999838, 0.731627893207702, 1.5945095463166976, 0.3494221976642885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 95.33333333333333, 89, 109, 94.0, 109.0, 109.0, 109.0, 0.04678970626462178, 0.03623460651156746, 0.016632278398752275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cbe12b3-00b3-4325-972a-148b88587cd5", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 105.57142857142858, 88, 269, 93.0, 185.0, 269.0, 269.0, 0.16504762802980288, 0.133940018449967, 0.05866927402621899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca3ed869-9b02-4772-a909-931b6f7d0af8", 3, 0, 0.0, 670.0, 183, 1160, 667.0, 1160.0, 1160.0, 1160.0, 0.0227581341364426, 0.02282480835754546, 0.014594246174736954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56a55a8b-f363-42eb-9dd9-a3d76c6a5a8c", 1, 0, 0.0, 1017.0, 1017, 1017, 1017.0, 1017.0, 1017.0, 1017.0, 0.9832841691248771, 0.17764411258603738, 0.6779283431661751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0decad51-9bb7-4de2-bea0-d7beb3119d08", 3, 0, 0.0, 471.3333333333333, 343, 628, 443.0, 628.0, 628.0, 628.0, 0.01740462266778056, 0.023993677408219623, 0.01116116753109626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 257.55555555555554, 174, 537, 181.0, 537.0, 537.0, 537.0, 0.04780901890581092, 0.07409464160500188, 0.10752360404304936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc8c7ca2-28a7-4043-8fa6-a5bf4923aee8", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 204.86666666666667, 175, 358, 182.0, 350.2, 358.0, 358.0, 0.08222737513773086, 0.12743637142927625, 0.18493129388886148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff904862-6a44-47d8-8693-af68745a1399", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/220abbdb-8d73-4168-9186-9c1adaedcb07", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3bbec6a-c91f-4e7b-9125-ad8b06aecf55", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.7826861213235294, 1.4624502144607845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acd35cd4-d115-473a-b8ad-8fe8dfb865c8", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d69b5138-e7af-4784-a544-02fa4a920b9f", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 129.3846153846154, 88, 377, 91.0, 332.59999999999997, 377.0, 377.0, 0.06383344381429379, 0.05292440800618693, 0.022690794480862243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 95.63157894736842, 88, 111, 93.0, 106.0, 111.0, 111.0, 0.10514665190924184, 0.0816324104178196, 0.03737634892086331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0af5b98-6633-49b9-b9fc-5ab3a015133b", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 107.84210526315789, 86, 268, 89.0, 256.0, 268.0, 268.0, 0.0826949860724234, 0.06145594179796309, 0.041509006680884405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 125.26315789473685, 85, 267, 88.0, 259.0, 267.0, 267.0, 0.08270290504835943, 0.028667166511417354, 0.046800934651646656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 184.78947368421052, 85, 1043, 91.0, 267.0, 1043.0, 1043.0, 0.08270218507878471, 3.937726648874815, 0.048245775115347785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 174.52631578947367, 85, 677, 92.0, 270.0, 677.0, 677.0, 0.08270290504835943, 1.3009809679939757, 0.04832695967798101], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 27.272727272727273, 0.684931506849315], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.0606060606060606, 0.15220700152207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.15220700152207], "isController": false}, {"data": ["401/Unauthorized", 20, 60.60606060606061, 1.5220700152207], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 33, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

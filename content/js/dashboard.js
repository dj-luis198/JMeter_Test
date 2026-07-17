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

    var data = {"OkPercent": 98.14097598760651, "KoPercent": 1.8590240123934934};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8007968127490039, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/553b6300-a5ce-4329-bfb6-2454d989ccf8"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "see books"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b8b9339-e82a-4aad-9b0b-e5d516a7abb8"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8312f5ca-1354-47ac-8774-40d094b8379c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cd09d83-613d-429b-b21a-99f707ab66fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/787b6306-8d97-4fee-8525-75c936fd85ab"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62c1ad65-14a9-426b-a860-858086ce2d42"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31f79f3c-154b-4130-8d3f-f91ed9b09f5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b3defa1-fcce-4c2f-9bbb-560fe80fed16"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad6b0c54-75c8-4be1-9e4e-d6b0a1ed04de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a429751-8559-4d15-8a00-d3863df55ec9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b8b9339-e82a-4aad-9b0b-e5d516a7abb8"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7f8a606-a77d-4339-ae38-9ecfc86d2da9"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8da28b8-d2a3-4101-8f75-081c7384a431"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7f8a606-a77d-4339-ae38-9ecfc86d2da9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9297fc19-6478-45a7-a1c6-70b1a4f4d2f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cd09d83-613d-429b-b21a-99f707ab66fe"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8312f5ca-1354-47ac-8774-40d094b8379c"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62c1ad65-14a9-426b-a860-858086ce2d42"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7596153846153846, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=787b6306-8d97-4fee-8525-75c936fd85ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a429751-8559-4d15-8a00-d3863df55ec9"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9297fc19-6478-45a7-a1c6-70b1a4f4d2f7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8da28b8-d2a3-4101-8f75-081c7384a431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b3defa1-fcce-4c2f-9bbb-560fe80fed16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/045e2bfc-713f-429a-983e-23c48e3cd7d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=553b6300-a5ce-4329-bfb6-2454d989ccf8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31f79f3c-154b-4130-8d3f-f91ed9b09f5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad6b0c54-75c8-4be1-9e4e-d6b0a1ed04de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1291, 24, 1.8590240123934934, 323.6498838109991, 81, 4472, 101.0, 889.5999999999999, 1106.1999999999996, 1677.5599999999959, 5.021978449449566, 682.7147791700704, 3.674001579093243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/553b6300-a5ce-4329-bfb6-2454d989ccf8", 3, 0, 0.0, 538.0, 173, 1225, 216.0, 1225.0, 1225.0, 1225.0, 0.027922561429635145, 0.02800436580882353, 0.01790606966679077], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1417.1346153846152, 1074, 1954, 1365.5, 1740.8000000000002, 1807.8999999999994, 1954.0, 0.25502197112366604, 306.8767004019048, 1.2539410396559165], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 683.9285714285714, 93, 1292, 521.0, 1239.5, 1292.0, 1292.0, 0.07996024833368554, 0.015098520664012748, 0.054074679659255116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 683.9285714285714, 93, 1292, 521.0, 1239.5, 1292.0, 1292.0, 0.07877648859428983, 0.014874996834873228, 0.05327413901518136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 110.76923076923076, 83, 259, 85.0, 254.2, 259.0, 259.0, 0.14858161702516742, 0.05692354618602419, 0.08377806621025442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 98.61538461538461, 83, 248, 86.0, 185.59999999999994, 248.0, 248.0, 0.14885552998293886, 0.1106240803877114, 0.07471849844846737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 204.84615384615387, 81, 494, 247.0, 400.3999999999999, 494.0, 494.0, 0.1488589389792857, 3.4039181748176475, 0.08667410126415591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 185.15384615384613, 82, 895, 84.0, 639.3999999999997, 895.0, 895.0, 0.1485697306316499, 10.320295000199998, 0.08636062016434097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b8b9339-e82a-4aad-9b0b-e5d516a7abb8", 3, 0, 0.0, 376.66666666666663, 174, 773, 183.0, 773.0, 773.0, 773.0, 0.029338418659234266, 0.024171724487800108, 0.018814024986553227], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 263.78571428571433, 87, 532, 218.0, 498.5, 532.0, 532.0, 0.07995020244533405, 0.17606221339280104, 0.05168097977545414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8312f5ca-1354-47ac-8774-40d094b8379c", 3, 0, 0.0, 322.0, 195, 524, 247.0, 524.0, 524.0, 524.0, 0.019967120807736594, 0.027526287962488433, 0.012804436195065457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 105.05555555555554, 83, 259, 86.5, 249.10000000000002, 259.0, 259.0, 0.13125273443196733, 0.09754231533469448, 0.0658827202129211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cd09d83-613d-429b-b21a-99f707ab66fe", 3, 0, 0.0, 411.0, 331, 454, 448.0, 454.0, 454.0, 454.0, 0.02214054819997343, 0.026169378422559744, 0.014198203110009005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 103.27777777777777, 82, 250, 85.0, 249.1, 250.0, 250.0, 0.1312565628281414, 0.04607367412641466, 0.07424484179938164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 582.1428571428572, 407, 685, 652.0, 685.0, 685.0, 685.0, 0.11515620116143255, 33.85974668720286, 0.0656750209748795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 845.7142857142857, 680, 986, 902.0, 986.0, 986.0, 986.0, 0.11426705843943846, 102.81770004387039, 0.06505634284198498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 184.42857142857142, 83, 261, 247.0, 261.0, 261.0, 261.0, 0.11563558272074007, 0.2046207772363096, 0.06402868691665979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 99.57142857142858, 84, 269, 86.5, 180.0, 269.0, 269.0, 0.07457042110982093, 0.05541805709431028, 0.037430855908640585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.0, 81, 248, 84.0, 248.0, 248.0, 248.0, 0.07457042110982093, 0.019953413461026304, 0.04252844328919475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 108.57142857142858, 82, 254, 84.0, 252.0, 254.0, 254.0, 0.07457200992873046, 0.020099487051103135, 0.04384018552450756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 122.14285714285715, 83, 260, 87.0, 259.0, 260.0, 260.0, 0.07457042110982093, 0.02009905881475642, 0.04391207414963088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 86.28571428571429, 82, 88, 88.0, 88.0, 88.0, 88.0, 0.11596699910539743, 0.08618250617110101, 0.0651181879742222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 564.6666666666667, 83, 1151, 750.5, 1049.3000000000002, 1151.0, 1151.0, 0.09053050878145935, 45.26612865454061, 0.048899834278874205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 125.77777777777779, 82, 820, 84.5, 163.90000000000103, 820.0, 820.0, 0.13125560570816044, 6.594746779224425, 0.07653728570699374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 389.77777777777777, 83, 831, 486.5, 682.5000000000002, 831.0, 831.0, 0.09053233010099385, 14.799462244246167, 0.04898922853880819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 144.66666666666669, 83, 647, 86.5, 296.00000000000057, 647.0, 647.0, 0.13125560570816044, 2.1774957478652732, 0.07666546500944312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/787b6306-8d97-4fee-8525-75c936fd85ab", 3, 0, 0.0, 482.6666666666667, 283, 661, 504.0, 661.0, 661.0, 661.0, 0.03839311995290444, 0.024683076792638762, 0.02462058799063208], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 489.35714285714295, 93, 888, 483.0, 824.0, 888.0, 888.0, 0.07894529091339703, 0.014906870989297275, 0.05402708211156097], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62c1ad65-14a9-426b-a860-858086ce2d42", 3, 0, 0.0, 302.3333333333333, 173, 444, 290.0, 444.0, 444.0, 444.0, 0.018379199647119367, 0.02533721045102556, 0.011786140398706103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 246.92857142857144, 168, 518, 177.5, 434.0, 518.0, 518.0, 0.07453508739238997, 0.11551482782394813, 0.16763115846159582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31f79f3c-154b-4130-8d3f-f91ed9b09f5b", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b3defa1-fcce-4c2f-9bbb-560fe80fed16", 3, 0, 0.0, 268.6666666666667, 180, 429, 197.0, 429.0, 429.0, 429.0, 0.08506053474722845, 0.03948447999659758, 0.05454728302475262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 693.0952380952381, 111, 2051, 508.0, 1488.4, 1997.9999999999993, 2051.0, 0.09741344119939141, 0.05983696729923554, 0.044045335229802945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 85.72222222222223, 83, 90, 86.0, 88.2, 90.0, 90.0, 0.09053233010099385, 0.06728037422544561, 0.04544298600772542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 177.38888888888889, 81, 263, 247.0, 260.3, 263.0, 263.0, 0.09053233010099385, 0.0997663134229268, 0.04740766331026435], "isController": false}, {"data": ["login", 21, 0, 0.0, 3077.3809523809527, 1620, 4818, 3083.0, 4495.200000000001, 4793.599999999999, 4818.0, 0.09706538971753971, 38.83851023837642, 0.20010257587277963], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad6b0c54-75c8-4be1-9e4e-d6b0a1ed04de", 3, 0, 0.0, 292.6666666666667, 180, 461, 237.0, 461.0, 461.0, 461.0, 0.021431786196500904, 0.025331645729002206, 0.013743691017938403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 98.66666666666667, 85, 272, 89.0, 110.00000000000026, 272.0, 272.0, 0.12983546960768047, 0.10511094170387414, 0.046152452087105174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a429751-8559-4d15-8a00-d3863df55ec9", 3, 0, 0.0, 333.0, 199, 474, 326.0, 474.0, 474.0, 474.0, 0.0637213254035684, 0.02883224033559898, 0.04086295932455395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b8b9339-e82a-4aad-9b0b-e5d516a7abb8", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 672.0555555555555, 168, 1235, 839.0, 1136.0000000000002, 1235.0, 1235.0, 0.09049136812894014, 60.206295182842844, 0.19065439398433495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7f8a606-a77d-4339-ae38-9ecfc86d2da9", 3, 0, 0.0, 713.6666666666666, 189, 1344, 608.0, 1344.0, 1344.0, 1344.0, 0.02273984855260864, 0.026877731150560538, 0.014582520067916348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 361.84615384615387, 168, 981, 335.0, 789.7999999999998, 981.0, 981.0, 0.14842215828652328, 13.871138883180345, 0.3308837433495456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 744.4444444444443, 86, 1074, 858.0, 1074.0, 1074.0, 1074.0, 0.111170127351557, 103.44959361142335, 0.21133904418394953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8da28b8-d2a3-4101-8f75-081c7384a431", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1109.958333333333, 138, 1839, 1146.0, 1595.0, 1782.75, 1839.0, 0.09477886905114505, 0.029618396578482826, 0.042761560060184584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 92.78571428571428, 85, 114, 89.5, 109.5, 114.0, 114.0, 0.06648399397844969, 0.05161599141881592, 0.023632982234527037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 261.1111111111111, 168, 1080, 176.0, 563.4000000000008, 1080.0, 1080.0, 0.13117238966944555, 8.910207660012098, 0.29314524062846153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 267.3157894736842, 167, 506, 191.0, 426.0, 506.0, 506.0, 0.14491979833265958, 0.2245973827675105, 0.32592802300792484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 118.90909090909092, 84, 266, 86.0, 262.8, 266.0, 266.0, 0.0580159596630855, 0.04311537627305475, 0.029121292252759712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 100.72727272727273, 82, 259, 85.0, 224.80000000000013, 259.0, 259.0, 0.0580159596630855, 0.023445370062709976, 0.03264427843968713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 172.63636363636365, 81, 890, 85.0, 761.4000000000004, 890.0, 890.0, 0.05801626565120621, 4.7599554346077575, 0.0336539665984536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 154.27272727272725, 82, 692, 84.0, 603.2000000000003, 692.0, 692.0, 0.05801626565120621, 1.5650073080716447, 0.03371062310787861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7f8a606-a77d-4339-ae38-9ecfc86d2da9", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 3.1712029569892475, 6.646925403225807], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 973.6346153846156, 654, 1594, 878.0, 1386.9, 1449.9499999999994, 1594.0, 0.246980426801176, 295.4744547432116, 0.4876898662031034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1109.958333333333, 138, 1839, 1146.0, 1595.0, 1782.75, 1839.0, 0.09396656356446498, 0.029364551113895306, 0.04239507067068635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 107.28571428571429, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.0628056166165717, 0.016928076353685345, 0.036984166816203846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 132.57142857142858, 82, 255, 87.0, 255.0, 255.0, 255.0, 0.06280223575959304, 0.016927165107077813, 0.0369208456321045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 167.2142857142857, 82, 910, 86.0, 578.0, 910.0, 910.0, 0.06539336444189099, 4.219299749461673, 0.03804273573140143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 136.0, 81, 484, 85.0, 365.0, 484.0, 484.0, 0.06539397534647129, 1.3897953139377917, 0.03810695243055393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 97.71428571428572, 83, 247, 86.5, 169.5, 247.0, 247.0, 0.0653906155125223, 0.04859595547366159, 0.03282302380218404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 108.71428571428571, 83, 258, 84.0, 258.0, 258.0, 258.0, 0.0628044896238011, 0.016805107575118657, 0.03581818548857407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9297fc19-6478-45a7-a1c6-70b1a4f4d2f7", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 96.14285714285714, 82, 249, 84.5, 168.5, 249.0, 249.0, 0.06539336444189099, 0.024513388707500153, 0.03690236595528028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 149.85714285714286, 84, 364, 87.0, 364.0, 364.0, 364.0, 0.06264710883592722, 0.04655707990638732, 0.031445912052408785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cd09d83-613d-429b-b21a-99f707ab66fe", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 543.357142857143, 86, 1225, 497.0, 999.0, 1225.0, 1225.0, 0.0790366560719911, 0.014769754577069208, 0.05379189824877352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 119.28571428571429, 88, 251, 95.0, 251.0, 251.0, 251.0, 0.0637720241240457, 0.05019555805076253, 0.022668961700344367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8312f5ca-1354-47ac-8774-40d094b8379c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1843.3333333333333, 1094, 4472, 1668.0, 3361.0000000000005, 4375.199999999999, 4472.0, 0.09541247722595038, 0.049383411064212596, 0.043886012474045534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 285.0, 168, 623, 174.0, 623.0, 623.0, 623.0, 0.06259724929801656, 0.09701351038667216, 0.14078268079426967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62c1ad65-14a9-426b-a860-858086ce2d42", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 915.9677419354839, 432, 3814, 751.5, 1529.4, 1615.95, 3814.0, 0.28518859245630174, 78.17311838776449, 1.0385207638569458], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 156.9230769230769, 83, 355, 88.0, 338.4, 348.7, 355.0, 0.2478562814884723, 0.18419788106711663, 0.11981333919608768], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 541.6538461538462, 407, 781, 496.5, 724.6000000000001, 747.8499999999999, 781.0, 0.24780903454553255, 72.8640841907367, 0.12463052030366138], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 140.0769230769231, 83, 274, 90.5, 257.0, 263.75, 274.0, 0.24818988435305964, 0.4391797562966251, 0.12070172110139034], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 811.4038461538462, 569, 1248, 771.0, 1027.1, 1109.6999999999994, 1248.0, 0.2474317064698633, 222.63948442012952, 0.1241991182866306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 127.78947368421053, 85, 404, 91.0, 327.0, 404.0, 404.0, 0.14392630972941856, 0.1075230731865285, 0.05116130541162925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, 6.818181818181818, 162.5, 82, 2568, 91.0, 305.7000000000002, 430.30000000000035, 1167.3699999999812, 0.7088285400145793, 1.4680039491516208, 0.3441372315714648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 118.09090909090911, 85, 251, 89.0, 250.2, 251.0, 251.0, 0.05768282834639063, 0.04467039343621852, 0.020504442888756042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=787b6306-8d97-4fee-8525-75c936fd85ab", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 90.0, 85, 100, 89.0, 97.6, 100.0, 100.0, 0.13213664962442698, 0.10723198812294807, 0.04697044967118303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 309.7272727272727, 169, 1156, 176.0, 1026.6000000000004, 1156.0, 1156.0, 0.05798996246467884, 6.38862607610919, 0.1290719414907638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a429751-8559-4d15-8a00-d3863df55ec9", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 266.42857142857144, 170, 1158, 174.0, 744.0, 1158.0, 1158.0, 0.06536405443891961, 5.679646647465976, 0.1458107185377127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9297fc19-6478-45a7-a1c6-70b1a4f4d2f7", 3, 0, 0.0, 290.0, 174, 520, 176.0, 520.0, 520.0, 520.0, 0.033980472555105, 0.028328121814330698, 0.021790862934100538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8da28b8-d2a3-4101-8f75-081c7384a431", 3, 0, 0.0, 461.6666666666667, 418, 532, 435.0, 532.0, 532.0, 532.0, 0.019247672635583815, 0.02653447057672443, 0.012343071319043006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 114.78571428571432, 85, 250, 91.5, 250.0, 250.0, 250.0, 0.07643339921164408, 0.06337105071356038, 0.027169684876014108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b3defa1-fcce-4c2f-9bbb-560fe80fed16", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/045e2bfc-713f-429a-983e-23c48e3cd7d1", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 92.72222222222221, 84, 123, 90.5, 111.30000000000001, 123.0, 123.0, 0.08565473527928202, 0.06649952592483321, 0.030447581681307283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=553b6300-a5ce-4329-bfb6-2454d989ccf8", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31f79f3c-154b-4130-8d3f-f91ed9b09f5b", 3, 0, 0.0, 449.3333333333333, 347, 536, 465.0, 536.0, 536.0, 536.0, 0.0726797005596337, 0.032885671802698836, 0.04660775068440051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad6b0c54-75c8-4be1-9e4e-d6b0a1ed04de", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 95.84210526315789, 83, 248, 87.0, 100.0, 248.0, 248.0, 0.14501713491936286, 0.1077715231187843, 0.0727918040513208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 124.10526315789475, 82, 339, 85.0, 251.0, 339.0, 339.0, 0.14501824176830663, 0.03880370922316018, 0.08270571600848739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 137.94736842105263, 82, 259, 85.0, 257.0, 259.0, 259.0, 0.14501602808731492, 0.03908635132040909, 0.08525356338726911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 155.0526315789474, 82, 257, 88.0, 256.0, 257.0, 257.0, 0.14501381447390513, 0.039085754682419746, 0.08539387707789532], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.6196746707978311], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.166666666666667, 0.07745933384972889], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07745933384972889], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0844306738962044], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1291, 24, "401/Unauthorized", 14, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

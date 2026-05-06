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

    var data = {"OkPercent": 98.12171299774606, "KoPercent": 1.8782870022539444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7929358392741412, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20689655172413793, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a3a37f9-ab44-4b33-b4d6-a96a67ef0d2d"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9caa251d-550d-417c-8ec9-3f5470a346d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dcdd646-c7a0-4892-8df4-8a174cb0ce2f"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e40ebd60-c627-4955-a0be-9b819c4f444c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d194ced0-faa6-47ee-a14f-27f6ab7743a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f75e75e7-3c0a-4fd9-b6b7-45d9065549dc"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/983b36d7-a40e-4eb6-a83e-e49ec9729f13"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=441e3234-605f-47da-9f3f-c77a7cea043c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf93df84-1c1c-4ac5-ad4a-e5617958fdb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bb2edf4-66f6-4ac7-a149-c2b1e7d323db"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e503c82-54a9-47cd-87ad-3d7c65eb89fd"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4482758620689655, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41c5e73d-1e46-4d7c-81bb-93771f440bd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dcdd646-c7a0-4892-8df4-8a174cb0ce2f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e503c82-54a9-47cd-87ad-3d7c65eb89fd"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/188f5470-585e-4230-91d7-4e7c06e5ed29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9caa251d-550d-417c-8ec9-3f5470a346d6"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5948275862068966, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e40ebd60-c627-4955-a0be-9b819c4f444c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68301fa5-01ae-4adc-b2b6-af2621c17055"], "isController": false}, {"data": [0.9361111111111111, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f75e75e7-3c0a-4fd9-b6b7-45d9065549dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bb2edf4-66f6-4ac7-a149-c2b1e7d323db"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf93df84-1c1c-4ac5-ad4a-e5617958fdb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/441e3234-605f-47da-9f3f-c77a7cea043c"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=983b36d7-a40e-4eb6-a83e-e49ec9729f13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41c5e73d-1e46-4d7c-81bb-93771f440bd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4be670e3-6a56-4e65-a940-d2d29389fca0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a3a37f9-ab44-4b33-b4d6-a96a67ef0d2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 25, 1.8782870022539444, 350.12021036814446, 93, 3247, 114.0, 986.8, 1218.7999999999997, 1662.520000000001, 5.269847051696765, 723.4147061050644, 3.860628958076803], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1615.793103448276, 1159, 2637, 1622.0, 1942.2, 2040.35, 2637.0, 0.2564442675863288, 308.587566874475, 1.2609344602511385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5a3a37f9-ab44-4b33-b4d6-a96a67ef0d2d", 3, 0, 0.0, 414.6666666666667, 252, 550, 442.0, 550.0, 550.0, 550.0, 0.01882435620701772, 0.022249751753802522, 0.01207160863535967], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 741.0714285714286, 108, 1968, 479.0, 1951.5, 1968.0, 1968.0, 0.08481198999218519, 0.01739899990004301, 0.05677599525355756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 741.0714285714286, 108, 1968, 479.0, 1951.5, 1968.0, 1968.0, 0.08483254661245462, 0.017403217047100242, 0.05678975654573989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9caa251d-550d-417c-8ec9-3f5470a346d6", 3, 0, 0.0, 389.33333333333337, 191, 729, 248.0, 729.0, 729.0, 729.0, 0.03281485856795957, 0.026865029068495548, 0.021043382610312616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 98.6923076923077, 96, 102, 97.0, 102.0, 102.0, 102.0, 0.07425516358983733, 0.02844811706040943, 0.041868934638320233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 100.61538461538461, 98, 111, 99.0, 107.8, 111.0, 111.0, 0.07425346706573145, 0.05518250823927894, 0.03727175983572849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 165.46153846153845, 96, 768, 99.0, 576.3999999999999, 768.0, 768.0, 0.0742509224249209, 1.6978762986771914, 0.04323309042334449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 249.0769230769231, 97, 1058, 106.0, 757.5999999999997, 1058.0, 1058.0, 0.07416958590549654, 5.1521396944926225, 0.0431133004609925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dcdd646-c7a0-4892-8df4-8a174cb0ce2f", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 220.85714285714286, 101, 442, 216.0, 420.5, 442.0, 442.0, 0.0841285484219888, 0.17464185275100352, 0.05437018702076773], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e40ebd60-c627-4955-a0be-9b819c4f444c", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.6875, 96, 302, 101.0, 179.5000000000001, 302.0, 302.0, 0.08622315630641554, 0.06407795112224828, 0.04327998275536874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 113.8125, 96, 306, 101.5, 172.30000000000013, 306.0, 306.0, 0.08622501495465103, 0.023071927829662484, 0.049175203841324414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 725.75, 588, 773, 771.0, 773.0, 773.0, 773.0, 0.0330139236222877, 9.707189710385355, 0.018828253315835954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1127.75, 1039, 1199, 1136.5, 1199.0, 1199.0, 1199.0, 0.03286770747740345, 29.574420963434676, 0.018712767050123254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 204.25, 100, 309, 204.0, 309.0, 309.0, 309.0, 0.03309012094439205, 0.05855400307738125, 0.01832236189010771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 101.71428571428571, 96, 112, 101.0, 110.5, 112.0, 112.0, 0.07912868019013491, 0.058805591430363936, 0.03971888829856381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 154.71428571428572, 95, 308, 99.5, 301.5, 308.0, 308.0, 0.07903397896567102, 0.0381056684298771, 0.04412583479640282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 279.57142857142856, 95, 1107, 101.5, 1074.0, 1107.0, 1107.0, 0.07867909046971416, 10.131831821336647, 0.04528877333678023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d194ced0-faa6-47ee-a14f-27f6ab7743a3", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f75e75e7-3c0a-4fd9-b6b7-45d9065549dc", 3, 0, 0.0, 303.3333333333333, 208, 473, 229.0, 473.0, 473.0, 473.0, 0.05165733964700818, 0.03321069199311235, 0.03312661429186397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 190.5, 94, 910, 98.5, 743.0, 910.0, 910.0, 0.0789145862339141, 3.3330183208667075, 0.04550139298336593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 101.25, 98, 105, 101.0, 105.0, 105.0, 105.0, 0.03314605810503986, 0.024632959197202473, 0.018612288486716717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 127.00000000000003, 96, 303, 102.0, 300.2, 303.0, 303.0, 0.08622687368301923, 0.02324083704737628, 0.050691970661306235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 633.7058823529412, 97, 1307, 926.0, 1255.8, 1307.0, 1307.0, 0.08580225104729218, 40.884126938436886, 0.04653865202140009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 168.12500000000003, 97, 399, 103.0, 327.6000000000001, 399.0, 399.0, 0.08622129773830758, 0.02323933415602822, 0.0507728931017573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 458.64705882352945, 96, 893, 577.0, 890.6, 893.0, 893.0, 0.08580398332374348, 13.36752913865419, 0.046623384550740436], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 438.5833333333333, 133, 801, 419.5, 730.2000000000003, 801.0, 801.0, 0.08988764044943821, 0.017095330056179775, 0.06143931413857678], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 383.14285714285717, 193, 1209, 207.0, 1174.5, 1209.0, 1209.0, 0.07863622321453646, 13.543926580447666, 0.17398044977111243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 753.7368421052631, 160, 2422, 633.0, 1413.0, 2422.0, 2422.0, 0.08442343239016066, 0.051857752903721736, 0.03817192304359804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 112.6470588235294, 95, 304, 100.0, 147.99999999999986, 304.0, 304.0, 0.0858000858000858, 0.06376354032604033, 0.0430676211926212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 200.64705882352942, 94, 413, 103.0, 345.79999999999995, 413.0, 413.0, 0.08580484948819932, 0.09118736876905373, 0.04512049587631988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/983b36d7-a40e-4eb6-a83e-e49ec9729f13", 3, 0, 0.0, 1051.0, 357, 2397, 399.0, 2397.0, 2397.0, 2397.0, 0.05467169646274124, 0.024737518907295027, 0.03505964909882821], "isController": false}, {"data": ["login", 19, 0, 0.0, 2932.8421052631584, 1456, 4575, 2858.0, 4411.0, 4575.0, 4575.0, 0.08621315521997967, 21.833189101182484, 0.16017408109254758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=441e3234-605f-47da-9f3f-c77a7cea043c", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.5625, 99, 297, 104.5, 175.90000000000012, 297.0, 297.0, 0.08571596942082792, 0.0693931041502601, 0.030469348505059918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf93df84-1c1c-4ac5-ad4a-e5617958fdb8", 3, 0, 0.0, 541.3333333333334, 214, 958, 452.0, 958.0, 958.0, 958.0, 0.01606580553948975, 0.022148009915279654, 0.010302616182550394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bb2edf4-66f6-4ac7-a149-c2b1e7d323db", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 770.7058823529411, 195, 1407, 1026.0, 1363.8, 1407.0, 1407.0, 0.08575680379347744, 54.37751831790551, 0.18125287695159784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e503c82-54a9-47cd-87ad-3d7c65eb89fd", 3, 0, 0.0, 284.3333333333333, 212, 419, 222.0, 419.0, 419.0, 419.0, 0.01949925902815693, 0.026881302729246288, 0.012504407645009489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 351.30769230769226, 198, 1158, 208.0, 861.9999999999998, 1158.0, 1158.0, 0.07412729366952911, 6.9277390747773335, 0.16525508520362198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 665.0, 100, 1304, 619.5, 1304.0, 1304.0, 1304.0, 0.047752356280330206, 28.570598501172917, 0.06945426331544609], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1172.0454545454545, 391, 2184, 1217.0, 2043.1, 2173.35, 2184.0, 0.09393279535459631, 0.0294040337731096, 0.0423798354041245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 311.25, 198, 606, 215.5, 550.7, 606.0, 606.0, 0.08617253896614496, 0.13355060482350786, 0.19380405980374205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 117.5, 97, 295, 105.5, 169.70000000000013, 295.0, 295.0, 0.08001440259246664, 0.06212055670020604, 0.028442619671540877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 342.7368421052632, 194, 1218, 205.0, 510.0, 1218.0, 1218.0, 0.13156072566126575, 8.476970922483037, 0.2941115215171029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 117.0, 95, 288, 102.5, 234.6000000000002, 288.0, 288.0, 0.0561377245508982, 0.041719539436751496, 0.028178506268712575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 130.5, 95, 295, 99.5, 292.90000000000003, 295.0, 295.0, 0.05614087617194079, 0.015022070381945096, 0.03201784344180998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 114.33333333333334, 94, 287, 98.5, 231.80000000000018, 287.0, 287.0, 0.05609049266149388, 0.015118140600168271, 0.03297507478732355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 133.5, 97, 305, 101.0, 302.6, 305.0, 305.0, 0.0560857738434646, 0.015116868731246319, 0.033027071901962066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.217457706766917, 4.647850093984962], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1101.2241379310346, 751, 2204, 1058.5, 1510.0, 1533.3499999999997, 2204.0, 0.2567496381158118, 307.1618278028871, 0.5069802424513393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1172.0454545454545, 391, 2184, 1217.0, 2043.1, 2173.35, 2184.0, 0.09452242544543693, 0.029588607255025802, 0.04264585991776549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 114.33333333333333, 94, 281, 99.0, 229.1000000000002, 281.0, 281.0, 0.07111827561887717, 0.019168597725400485, 0.041879218943538014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 147.16666666666669, 97, 287, 102.5, 286.7, 287.0, 287.0, 0.07103954534690979, 0.019147377456784277, 0.04176348271371064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 185.25, 96, 1083, 99.5, 537.7000000000005, 1083.0, 1083.0, 0.07843560191971136, 4.430850323117913, 0.04569027006358186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 139.1875, 96, 760, 97.0, 299.40000000000043, 760.0, 760.0, 0.07843675546361026, 1.4612579876805272, 0.045767540419440554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41c5e73d-1e46-4d7c-81bb-93771f440bd8", 3, 0, 0.0, 1049.3333333333333, 237, 2427, 484.0, 2427.0, 2427.0, 2427.0, 0.018449390247652315, 0.02543397386028892, 0.01183115194917808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 112.125, 96, 297, 99.5, 161.90000000000015, 297.0, 297.0, 0.07843560191971136, 0.05829052056728549, 0.039370995494855114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 164.41666666666666, 94, 302, 102.0, 300.5, 302.0, 302.0, 0.07103281716152862, 0.01900682802954965, 0.04051090353743429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 147.0, 93, 305, 99.0, 302.2, 305.0, 305.0, 0.07843713998578326, 0.028351119567615265, 0.044321963011986175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 150.5, 97, 312, 103.0, 307.5, 312.0, 312.0, 0.0711165897224675, 0.0528512937292947, 0.03569719445053545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 123.25, 100, 310, 106.0, 251.20000000000022, 310.0, 310.0, 0.07429420505200594, 0.058477665304606234, 0.026409268202080238], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 605.9166666666666, 100, 2397, 441.0, 1896.6000000000017, 2397.0, 2397.0, 0.08891984616866613, 0.016708652734655768, 0.060517307414433175], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8dcdd646-c7a0-4892-8df4-8a174cb0ce2f", 3, 0, 0.0, 302.0, 218, 430, 258.0, 430.0, 430.0, 430.0, 0.02146905593404706, 0.02537569729704586, 0.013767591207705961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e503c82-54a9-47cd-87ad-3d7c65eb89fd", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1539.0526315789473, 876, 3247, 1418.0, 1981.0, 3247.0, 3247.0, 0.0850599000770016, 0.044025143594541835, 0.03912423138307397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 318.5, 199, 602, 207.5, 599.0, 602.0, 602.0, 0.07098911500236631, 0.11001926319214388, 0.15965618344770469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/188f5470-585e-4230-91d7-4e7c06e5ed29", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9caa251d-550d-417c-8ec9-3f5470a346d6", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 1007.0327868852459, 509, 2399, 871.0, 1720.8, 1838.3999999999999, 2399.0, 0.2894012714678812, 80.55168229314926, 1.0545420210053136], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 176.051724137931, 96, 729, 104.5, 396.0, 402.59999999999997, 729.0, 0.2580610714873661, 0.19178171425965396, 0.12474631873656859], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 629.8965517241376, 472, 884, 592.0, 804.1, 817.8499999999998, 884.0, 0.25825526306415414, 75.93562222264275, 0.12988423874808536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e40ebd60-c627-4955-a0be-9b819c4f444c", 3, 0, 0.0, 334.0, 188, 411, 403.0, 411.0, 411.0, 411.0, 0.034404064266792045, 0.03450485742382367, 0.02206250215025402], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 169.77586206896552, 94, 400, 103.0, 296.1, 308.2, 400.0, 0.2586018556912472, 0.45760406495365236, 0.12576535559984484], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 921.7241379310343, 652, 1441, 911.0, 1121.2, 1163.9499999999998, 1441.0, 0.25761977098490707, 231.80672277947303, 0.12931304910765842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 118.73684210526315, 99, 290, 107.0, 152.0, 290.0, 290.0, 0.13561354422429053, 0.10131285286287328, 0.04820637704847827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68301fa5-01ae-4adc-b2b6-af2621c17055", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, 5.555555555555555, 159.57777777777784, 95, 976, 109.0, 285.9, 347.5499999999999, 665.7699999999991, 0.7286829864667377, 1.5322979245691664, 0.3505047394755912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 152.33333333333334, 99, 290, 108.0, 289.1, 290.0, 290.0, 0.05696112403284758, 0.044111495466843884, 0.02024789955855129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f75e75e7-3c0a-4fd9-b6b7-45d9065549dc", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bb2edf4-66f6-4ac7-a149-c2b1e7d323db", 3, 0, 0.0, 314.0, 204, 404, 334.0, 404.0, 404.0, 404.0, 0.03301564941782405, 0.02752378846323157, 0.021172144971716593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 170.84615384615384, 100, 662, 107.0, 553.5999999999999, 662.0, 662.0, 0.07481928265573921, 0.060717601452069614, 0.026595916881532296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf93df84-1c1c-4ac5-ad4a-e5617958fdb8", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/441e3234-605f-47da-9f3f-c77a7cea043c", 3, 0, 0.0, 323.0, 244, 430, 295.0, 430.0, 430.0, 430.0, 0.02571134727459719, 0.025786673487315732, 0.016488071006170724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 284.25, 201, 593, 207.0, 535.4000000000002, 593.0, 593.0, 0.05605773947165581, 0.08687854740382595, 0.12607516992502277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=983b36d7-a40e-4eb6-a83e-e49ec9729f13", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41c5e73d-1e46-4d7c-81bb-93771f440bd8", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4be670e3-6a56-4e65-a940-d2d29389fca0", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 347.625, 194, 1381, 206.0, 698.5000000000007, 1381.0, 1381.0, 0.07839716986216798, 5.9757984338327885, 0.17506340677351548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a3a37f9-ab44-4b33-b4d6-a96a67ef0d2d", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 116.71428571428571, 99, 213, 105.0, 172.5, 213.0, 213.0, 0.08032128514056225, 0.0665945030120482, 0.028551706827309235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 120.6470588235294, 97, 333, 105.0, 173.79999999999984, 333.0, 333.0, 0.0847892985929964, 0.06582762927874232, 0.03013994598422919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 102.99999999999999, 96, 162, 99.0, 107.0, 162.0, 162.0, 0.13165097248494673, 0.09783827154398875, 0.06608261704810804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 178.36842105263156, 93, 295, 102.0, 292.0, 295.0, 295.0, 0.1316491480914338, 0.04563331901360143, 0.07449923522238312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 190.52631578947367, 96, 1055, 102.0, 298.0, 1055.0, 1055.0, 0.1316491480914338, 6.268254680906716, 0.07679984739092174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 161.99999999999997, 96, 573, 98.0, 409.0, 573.0, 573.0, 0.1316500602818697, 2.0709577585191448, 0.0769289440452599], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5259203606311045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.22539444027047334], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07513148009015777], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.051840721262209], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 98.671875, "KoPercent": 1.328125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7831769436997319, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5a997cb-ae96-40e6-8588-e6de7ffb004f"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97274fd9-42a7-4904-83a6-7184067fffaf"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=540f5bb1-5c06-4acd-8875-ac8590184d1b"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/30492b1b-6d5e-425f-bd3c-98efa66542f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/269ef3f2-72dc-43c3-91be-3092e0c0bc8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=296de60f-2c3f-4e5f-a6f6-ff9141993d06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e066d2b-4ce0-4855-b95b-1f3efd925f86"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a1c6a44-7705-4f7a-800b-947e9a641e27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b3d73ce-a609-4d40-8d06-37b7de32f768"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=269ef3f2-72dc-43c3-91be-3092e0c0bc8c"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/262928ac-cfe8-4ae1-95a4-6168d5d5e448"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b9f3368-8ced-460d-9437-4bba6d3360c1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5d47a99f-c8b4-4253-9644-74e899d44677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78881618-15ed-4090-9353-f8028c1ee330"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6609c8e8-49d9-49f2-86f0-af1540708acf"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/540f5bb1-5c06-4acd-8875-ac8590184d1b"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a1c6a44-7705-4f7a-800b-947e9a641e27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/296de60f-2c3f-4e5f-a6f6-ff9141993d06"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c98f149-0376-4908-bc7e-7a157eb00e06"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97274fd9-42a7-4904-83a6-7184067fffaf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e066d2b-4ce0-4855-b95b-1f3efd925f86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b3d73ce-a609-4d40-8d06-37b7de32f768"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9540229885057471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b9f3368-8ced-460d-9437-4bba6d3360c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6609c8e8-49d9-49f2-86f0-af1540708acf"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c98f149-0376-4908-bc7e-7a157eb00e06"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78881618-15ed-4090-9353-f8028c1ee330"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d47a99f-c8b4-4253-9644-74e899d44677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=262928ac-cfe8-4ae1-95a4-6168d5d5e448"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 17, 1.328125, 370.43359375000074, 100, 3366, 123.0, 1016.8000000000002, 1218.95, 1868.3300000000004, 5.05641058053914, 693.2581403148998, 3.695567511722577], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b5a997cb-ae96-40e6-8588-e6de7ffb004f", 2, 0, 0.0, 237.5, 220, 255, 237.5, 255.0, 255.0, 255.0, 0.011589567071722035, 0.022907503665200588, 0.007203866641749098], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1707.6296296296293, 1237, 2283, 1677.0, 2075.0, 2179.25, 2283.0, 0.2513170877003556, 302.41937873630553, 1.2357241568079007], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97274fd9-42a7-4904-83a6-7184067fffaf", 3, 0, 0.0, 383.3333333333333, 216, 521, 413.0, 521.0, 521.0, 521.0, 0.01720578114246387, 0.02371955831325992, 0.011033655224822206], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 591.9999999999999, 106, 1420, 509.0, 1133.5, 1420.0, 1420.0, 0.07135976023120562, 0.013474530618434266, 0.04825843160166982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 591.9999999999999, 106, 1420, 509.0, 1133.5, 1420.0, 1420.0, 0.07043599883277488, 0.013300101063080468, 0.04763371991376621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 192.49999999999997, 101, 307, 104.5, 306.1, 307.0, 307.0, 0.09077110049873677, 0.03186246854529226, 0.05134437357854978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 126.88888888888889, 102, 307, 104.0, 305.2, 307.0, 307.0, 0.09086365907955113, 0.06752660601517424, 0.045609297623915315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 187.88888888888886, 101, 916, 104.0, 461.50000000000074, 916.0, 916.0, 0.09086457644487297, 1.5074192661928247, 0.05307335232234713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 220.77777777777777, 101, 1009, 104.5, 378.100000000001, 1009.0, 1009.0, 0.09077110049873677, 4.560661767023364, 0.05293011003474516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=540f5bb1-5c06-4acd-8875-ac8590184d1b", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 254.2, 103, 803, 226.0, 474.20000000000016, 803.0, 803.0, 0.07166506614685605, 0.16449838783461615, 0.0463256798028733], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 114.21052631578948, 101, 309, 104.0, 105.0, 309.0, 309.0, 0.13904643419078633, 0.10333431290936367, 0.06979479216217205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 124.2631578947368, 100, 308, 103.0, 306.0, 308.0, 308.0, 0.13904643419078633, 0.04819742764096747, 0.07868530224303852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 785.25, 705, 816, 810.0, 816.0, 816.0, 816.0, 0.031749307468230854, 9.335350571884401, 0.018107026915475406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 985.5, 912, 1101, 964.5, 1101.0, 1101.0, 1101.0, 0.03172463020977912, 28.545878028710792, 0.018061972082325416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 205.25, 104, 307, 205.0, 307.0, 307.0, 307.0, 0.031929499664740256, 0.0565002474536224, 0.01767971319326926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30492b1b-6d5e-425f-bd3c-98efa66542f5", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.559257333625219, 1.0449731830122593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 118.07142857142856, 101, 304, 104.0, 205.5, 304.0, 304.0, 0.07433641475471639, 0.05524415198079997, 0.037313395687426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 131.35714285714286, 101, 304, 103.0, 303.5, 304.0, 304.0, 0.07433720417775087, 0.035841152014272744, 0.041503556238749864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 275.1428571428571, 101, 1108, 103.0, 1107.5, 1108.0, 1108.0, 0.07394222999202481, 9.521846710495044, 0.04256217089105669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 232.71428571428572, 101, 810, 103.5, 809.0, 810.0, 810.0, 0.07405879210110083, 3.127930116272304, 0.04270158869333841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/269ef3f2-72dc-43c3-91be-3092e0c0bc8c", 3, 0, 0.0, 297.0, 197, 443, 251.0, 443.0, 443.0, 443.0, 0.053966540744738264, 0.034695285797805356, 0.03460744963122864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 154.5, 103, 307, 104.0, 307.0, 307.0, 307.0, 0.03192975454001197, 0.023729046098583118, 0.017929305527838755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=296de60f-2c3f-4e5f-a6f6-ff9141993d06", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e066d2b-4ce0-4855-b95b-1f3efd925f86", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 699.1111111111111, 101, 1528, 908.0, 1242.7000000000005, 1528.0, 1528.0, 0.08476292281394067, 42.38227997252269, 0.045784486736957106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 155.7894736842105, 101, 1106, 103.0, 105.0, 1106.0, 1106.0, 0.1390474517724891, 6.62051257510392, 0.08111577804367553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 493.72222222222234, 101, 903, 606.0, 900.3, 903.0, 903.0, 0.08476212451556092, 13.85619767116063, 0.04586683105024981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 156.05263157894737, 101, 608, 103.0, 410.0, 608.0, 608.0, 0.13904948698057698, 2.187356490866644, 0.08125275583276007], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 499.0000000000001, 106, 1193, 445.0, 1033.0, 1193.0, 1193.0, 0.07072207235878318, 0.013354118992412532, 0.04839943163448812], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a1c6a44-7705-4f7a-800b-947e9a641e27", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b3d73ce-a609-4d40-8d06-37b7de32f768", 3, 0, 0.0, 289.3333333333333, 206, 416, 246.0, 416.0, 416.0, 416.0, 0.08775778850372971, 0.039708113938862075, 0.05627696723709229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=269ef3f2-72dc-43c3-91be-3092e0c0bc8c", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 423.5, 206, 1211, 211.0, 1210.5, 1211.0, 1211.0, 0.07390124681960705, 12.728396916998342, 0.16350444661162783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 545.7368421052632, 166, 1233, 497.0, 1028.0, 1233.0, 1233.0, 0.08302671712360493, 0.05099980963940186, 0.03754040041819246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 116.6111111111111, 102, 311, 104.0, 134.60000000000028, 311.0, 311.0, 0.08476092709618481, 0.06299127492206703, 0.042546012233827146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 166.1111111111111, 101, 422, 103.0, 320.3000000000002, 422.0, 422.0, 0.08476212451556092, 0.09340756690321578, 0.04438606910938552], "isController": false}, {"data": ["login", 19, 0, 0.0, 2877.736842105263, 1867, 4082, 2714.0, 3903.0, 4082.0, 4082.0, 0.0804168130393746, 20.365285106700412, 0.14940514704637511], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/262928ac-cfe8-4ae1-95a4-6168d5d5e448", 3, 0, 0.0, 360.0, 235, 427, 418.0, 427.0, 427.0, 427.0, 0.022044559402739403, 0.026055922913849863, 0.014136647794074423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 147.15789473684214, 104, 433, 107.0, 309.0, 433.0, 433.0, 0.13844562001777935, 0.11208146386204987, 0.049213091490695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b9f3368-8ced-460d-9437-4bba6d3360c1", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d47a99f-c8b4-4253-9644-74e899d44677", 3, 0, 0.0, 770.6666666666667, 250, 1777, 285.0, 1777.0, 1777.0, 1777.0, 0.04864523033516564, 0.03155922658137536, 0.031195020755298276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78881618-15ed-4090-9353-f8028c1ee330", 3, 0, 0.0, 290.6666666666667, 201, 445, 226.0, 445.0, 445.0, 445.0, 0.027120360158382904, 0.02719981433853442, 0.01739163721094216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 817.2222222222222, 206, 1636, 1012.0, 1348.0000000000005, 1636.0, 1636.0, 0.08471943746293525, 56.366077395912754, 0.17849363251061345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6609c8e8-49d9-49f2-86f0-af1540708acf", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 411.22222222222223, 207, 1113, 409.5, 756.6000000000006, 1113.0, 1113.0, 0.0907235200725788, 6.162618562725234, 0.20274974168997756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 794.5, 103, 1408, 1017.0, 1408.0, 1408.0, 1408.0, 0.04754772603000262, 37.926647974466874, 0.08197803740817346], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1311.3478260869563, 183, 3366, 1194.0, 2468.2000000000007, 3220.999999999998, 3366.0, 0.09249168580172194, 0.028856526293777725, 0.04172964730507377], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 308.94736842105266, 206, 1415, 208.0, 515.0, 1415.0, 1415.0, 0.13893967093235832, 8.952425159963436, 0.31060757541133455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 135.88235294117646, 105, 317, 109.0, 310.6, 317.0, 317.0, 0.1045375443515905, 0.08115951929640083, 0.037159830218729435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/540f5bb1-5c06-4acd-8875-ac8590184d1b", 3, 0, 0.0, 352.3333333333333, 198, 462, 397.0, 462.0, 462.0, 462.0, 0.022088708252341403, 0.02610810535945691, 0.01416495939359133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 354.8888888888888, 207, 616, 408.5, 610.6, 616.0, 616.0, 0.09577269945994839, 0.14842897855755674, 0.21539504575806753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a1c6a44-7705-4f7a-800b-947e9a641e27", 3, 0, 0.0, 1049.0, 803, 1347, 997.0, 1347.0, 1347.0, 1347.0, 0.08470030209774415, 0.038324680962195434, 0.05431627445721224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 134.14285714285714, 103, 312, 104.0, 312.0, 312.0, 312.0, 0.047757772577486986, 0.03549186028463632, 0.023972163188308897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 165.85714285714286, 101, 339, 103.0, 339.0, 339.0, 339.0, 0.04768165005755856, 0.012758566519307664, 0.02719344104845137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 132.0, 101, 309, 103.0, 309.0, 309.0, 309.0, 0.047758424244905194, 0.012872387784759605, 0.028076729878352472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 132.42857142857144, 101, 310, 103.0, 310.0, 310.0, 310.0, 0.04775809840897307, 0.012872299961793522, 0.028123177090440193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 2.7822818396226414, 5.831736438679245], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1155.6481481481485, 806, 1826, 1107.0, 1633.5, 1687.25, 1826.0, 0.24368011119033223, 291.52612989729334, 0.4811730320574724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1311.3478260869563, 183, 3366, 1194.0, 2468.2000000000007, 3220.999999999998, 3366.0, 0.0920806626604906, 0.02872829098290102, 0.041544205223776026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 107.66666666666667, 101, 120, 102.0, 120.0, 120.0, 120.0, 0.026803423690652754, 0.00722436029162125, 0.015783656724085555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 171.0, 102, 309, 102.0, 309.0, 309.0, 309.0, 0.026802705286386907, 0.0072241666592214706, 0.0157570591625048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 173.64705882352942, 101, 1103, 103.0, 462.99999999999943, 1103.0, 1103.0, 0.10540674603174603, 5.605867173936632, 0.061434791201636904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 182.11764705882354, 100, 837, 104.0, 414.5999999999996, 837.0, 837.0, 0.10540674603174603, 1.8498617505270336, 0.06153772747705853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 179.66666666666666, 103, 307, 129.0, 307.0, 307.0, 307.0, 0.026802705286386907, 0.007171817625458996, 0.015285917858642532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 127.52941176470586, 101, 310, 103.0, 306.8, 310.0, 310.0, 0.10540674603174603, 0.07833450559585814, 0.05290924556671627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 177.0, 103, 305, 123.0, 305.0, 305.0, 305.0, 0.02680246582685607, 0.019918629388903777, 0.013453581479496112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 140.88235294117646, 101, 328, 104.0, 314.4, 328.0, 328.0, 0.10540739959945188, 0.03751747747691888, 0.0595944179031368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 182.66666666666669, 105, 336, 107.0, 336.0, 336.0, 336.0, 0.02409754686972866, 0.018967405055665333, 0.00856592486384886], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 645.8461538461538, 103, 1777, 462.0, 1478.9999999999998, 1777.0, 1777.0, 0.06865991686868528, 0.012863418920560477, 0.046729180200592586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1686.5789473684208, 1081, 3063, 1646.0, 2469.0, 3063.0, 3063.0, 0.08029175488194999, 0.04155725594475927, 0.03693107084902192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 358.3333333333333, 227, 614, 234.0, 614.0, 614.0, 614.0, 0.02677758537586804, 0.04150002733545174, 0.06022341710998447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/296de60f-2c3f-4e5f-a6f6-ff9141993d06", 3, 0, 0.0, 1065.0, 227, 1936, 1032.0, 1936.0, 1936.0, 1936.0, 0.019774569903104607, 0.02726084099597917, 0.012680957913123722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c98f149-0376-4908-bc7e-7a157eb00e06", 3, 0, 0.0, 503.6666666666667, 244, 696, 571.0, 696.0, 696.0, 696.0, 0.016922000857381377, 0.02332834428092778, 0.010851673726901469], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1106.566666666667, 568, 2500, 890.5, 1897.3999999999999, 2132.6999999999994, 2500.0, 0.29531046974052055, 89.41049820260514, 1.0755424561094815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97274fd9-42a7-4904-83a6-7184067fffaf", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.1514367665549036, 0.5779154442581727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e066d2b-4ce0-4855-b95b-1f3efd925f86", 3, 0, 0.0, 431.0, 212, 655, 426.0, 655.0, 655.0, 655.0, 0.06431143886125879, 0.02909925130766592, 0.04124138494683587], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 169.55555555555551, 102, 425, 104.0, 417.0, 418.0, 425.0, 0.24491239846340146, 0.1820100929986802, 0.11839027074158567], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 664.462962962963, 503, 919, 608.0, 850.5, 913.0, 919.0, 0.24450541987014046, 71.89271178584042, 0.12296903440734602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b3d73ce-a609-4d40-8d06-37b7de32f768", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 144.74074074074076, 102, 312, 106.5, 308.0, 310.25, 312.0, 0.2453029036595559, 0.43407115374132355, 0.11929770119380746], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 984.4444444444443, 703, 1514, 1003.5, 1218.0, 1376.25, 1514.0, 0.24418036789842096, 219.71392425830214, 0.12256709873026209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 123.33333333333333, 103, 309, 107.5, 156.90000000000023, 309.0, 309.0, 0.10072803988830378, 0.07525092823686758, 0.035805670429045484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 185.37931034482762, 103, 1874, 111.0, 309.0, 461.25, 1333.25, 0.7443372617799927, 1.5181763068680085, 0.3607848359998289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 168.0, 104, 316, 112.0, 316.0, 316.0, 316.0, 0.04871903731182272, 0.03772870760573771, 0.01731809529443698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 106.83333333333333, 104, 115, 106.0, 114.1, 115.0, 115.0, 0.08964188068665681, 0.07274648715880058, 0.031864887275335034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b9f3368-8ced-460d-9437-4bba6d3360c1", 3, 0, 0.0, 289.6666666666667, 198, 422, 249.0, 422.0, 422.0, 422.0, 0.01786299086010301, 0.02462557496501831, 0.011455108071094703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6609c8e8-49d9-49f2-86f0-af1540708acf", 2, 0, 0.0, 207.0, 192, 222, 207.0, 222.0, 222.0, 222.0, 0.023230962226455418, 0.02622557845095944, 0.014439948688612182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 330.7142857142857, 207, 624, 210.0, 624.0, 624.0, 624.0, 0.04764757133522109, 0.07384442940331627, 0.10716050467286538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c98f149-0376-4908-bc7e-7a157eb00e06", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 327.23529411764713, 207, 1208, 209.0, 738.3999999999996, 1208.0, 1208.0, 0.10533816649626669, 7.566654467577532, 0.2353226078167116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78881618-15ed-4090-9353-f8028c1ee330", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d47a99f-c8b4-4253-9644-74e899d44677", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 109.4285714285714, 105, 121, 107.5, 120.5, 121.0, 121.0, 0.07270914265533789, 0.06028326378357604, 0.02584582805326464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 121.55555555555557, 104, 312, 107.0, 153.60000000000025, 312.0, 312.0, 0.08511040711144735, 0.06607692739609437, 0.0302540900278973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=262928ac-cfe8-4ae1-95a4-6168d5d5e448", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 126.8888888888889, 103, 309, 105.0, 304.5, 309.0, 309.0, 0.09592735101949457, 0.0712897598885111, 0.04815103361720724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 181.72222222222223, 101, 307, 104.5, 306.1, 307.0, 307.0, 0.09582674524459776, 0.02564114081740214, 0.054651190647309666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 159.7777777777778, 102, 307, 104.0, 307.0, 307.0, 307.0, 0.09592888472012748, 0.025855832209721857, 0.056395691993668694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 170.61111111111111, 101, 307, 103.5, 306.1, 307.0, 307.0, 0.09592888472012748, 0.025855832209721857, 0.05648937254515319], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 47.05882352941177, 0.625], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.078125], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.078125], "isController": false}, {"data": ["401/Unauthorized", 7, 41.1764705882353, 0.546875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 17, "406/Not Acceptable", 8, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

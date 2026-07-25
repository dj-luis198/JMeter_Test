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

    var data = {"OkPercent": 97.63358778625954, "KoPercent": 2.366412213740458};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7688277668631304, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16964285714285715, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ab267a14-1ab3-4595-acb8-b18eae5e676c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b00798a-c14d-4a11-bdb9-f1d1dce59291"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5887792-dffe-4ec0-b3c4-6b69b2d3e900"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12eb4106-8db8-4296-a787-d16de27ff188"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9eadfca1-a56b-4c06-aeae-60fd88ffd9b0"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35741238-9f55-4d54-a23f-7e0ed2f94977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35f19b12-e136-4884-be98-9714796f8f1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89695d19-5d40-46e3-aa71-8e4d0656799c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6ae0b3b-9d31-4931-b1d4-056c38ab699e"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a5118e0-5f80-4897-a594-1c5682f28027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89695d19-5d40-46e3-aa71-8e4d0656799c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ffdba19-e897-413c-8bf0-9c643030f95a"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1676a2ba-a09d-4bfe-b52b-224d371e63a4"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5887792-dffe-4ec0-b3c4-6b69b2d3e900"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35f19b12-e136-4884-be98-9714796f8f1c"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eadfca1-a56b-4c06-aeae-60fd88ffd9b0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12eb4106-8db8-4296-a787-d16de27ff188"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93044b22-a2b7-4cc2-9766-6f26d6d0249e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b00798a-c14d-4a11-bdb9-f1d1dce59291"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59eea8ff-7e4f-4d5d-b291-479a9cd9ce71"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a5118e0-5f80-4897-a594-1c5682f28027"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ded8981-39b1-4f4c-8ff1-e95920c54e6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab267a14-1ab3-4595-acb8-b18eae5e676c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1676a2ba-a09d-4bfe-b52b-224d371e63a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6ae0b3b-9d31-4931-b1d4-056c38ab699e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59eea8ff-7e4f-4d5d-b291-479a9cd9ce71"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ffdba19-e897-413c-8bf0-9c643030f95a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1310, 31, 2.366412213740458, 381.14503816793894, 95, 4691, 117.0, 1024.5000000000005, 1230.5000000000005, 2049.400000000016, 5.187646273804763, 751.9115252929931, 3.793632628265544], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1642.1428571428573, 1204, 2253, 1625.0, 1953.9, 2103.7999999999997, 2253.0, 0.25343380173330615, 304.9666643331523, 1.2461320231710904], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ab267a14-1ab3-4595-acb8-b18eae5e676c", 3, 0, 0.0, 1438.6666666666667, 212, 3348, 756.0, 3348.0, 3348.0, 3348.0, 0.01972425491627054, 0.027191477724741446, 0.01264869211753026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b00798a-c14d-4a11-bdb9-f1d1dce59291", 3, 0, 0.0, 315.0, 208, 518, 219.0, 518.0, 518.0, 518.0, 0.08634832915983076, 0.03907037029041821, 0.055373114728146676], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 726.3571428571428, 109, 2556, 574.0, 1821.0, 2556.0, 2556.0, 0.09705305335838227, 0.0191181516939224, 0.06530229859758338], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 726.3571428571428, 109, 2556, 574.0, 1821.0, 2556.0, 2556.0, 0.09782479579073879, 0.019270174617260487, 0.06582156669904202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5887792-dffe-4ec0-b3c4-6b69b2d3e900", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 137.16666666666666, 96, 361, 101.0, 304.30000000000007, 361.0, 361.0, 0.12575189151803493, 0.0546343938409518, 0.0705444096298004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 103.27777777777779, 97, 117, 103.0, 107.10000000000002, 117.0, 117.0, 0.12574837749662923, 0.09345167507317857, 0.06311979104811273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 202.0, 97, 793, 102.0, 618.4000000000003, 793.0, 793.0, 0.12575101299427133, 4.138458196520889, 0.07284989782730195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12eb4106-8db8-4296-a787-d16de27ff188", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 279.3333333333333, 99, 1327, 102.0, 1099.3000000000004, 1327.0, 1327.0, 0.12575101299427133, 12.602459240079643, 0.07272709410367473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eadfca1-a56b-4c06-aeae-60fd88ffd9b0", 3, 0, 0.0, 2183.0, 201, 3587, 2761.0, 3587.0, 3587.0, 3587.0, 0.03511482547931737, 0.02257544932345436, 0.022518296287192454], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 238.4666666666667, 101, 383, 218.0, 369.2, 383.0, 383.0, 0.09244194645762462, 0.14088369300954, 0.0597442189117734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35741238-9f55-4d54-a23f-7e0ed2f94977", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 103.94444444444444, 97, 113, 103.5, 112.1, 113.0, 113.0, 0.09287158954885046, 0.06901882777995624, 0.046617184597762824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 145.27777777777777, 97, 306, 102.0, 301.5, 306.0, 306.0, 0.09287446468190495, 0.032600791367834475, 0.0525341345905784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 719.1250000000001, 587, 813, 780.0, 813.0, 813.0, 813.0, 0.08232739546993506, 24.20698779496362, 0.04695234272894734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 988.2500000000001, 709, 1300, 991.0, 1300.0, 1300.0, 1300.0, 0.08226813241055911, 74.02501015497259, 0.04683820429233981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35f19b12-e136-4884-be98-9714796f8f1c", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 0.2027655022446689, 0.7737969977553311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 225.75, 97, 306, 296.0, 306.0, 306.0, 306.0, 0.0827300930713547, 0.14639348500517063, 0.04580855739400207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 124.0909090909091, 101, 306, 102.0, 268.60000000000014, 306.0, 306.0, 0.05599731212901781, 0.0416151899708814, 0.028108025814760892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 100.9090909090909, 97, 103, 101.0, 103.0, 103.0, 103.0, 0.05599930764492367, 0.01498418974092684, 0.03193710514124552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89695d19-5d40-46e3-aa71-8e4d0656799c", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 137.7272727272727, 96, 314, 102.0, 310.2, 314.0, 314.0, 0.05599959273023469, 0.015093640228071067, 0.03292163556992313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 137.8181818181818, 98, 307, 100.0, 306.6, 307.0, 307.0, 0.05599902256251527, 0.015093486550052946, 0.03297598691913741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 153.875, 102, 299, 106.0, 299.0, 299.0, 299.0, 0.08273779358988945, 0.061487754806548695, 0.04645921026776018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 178.2777777777778, 96, 885, 101.5, 365.70000000000084, 885.0, 885.0, 0.09287254790675596, 4.666245931988917, 0.05415549831281538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6ae0b3b-9d31-4931-b1d4-056c38ab699e", 3, 0, 0.0, 366.3333333333333, 311, 452, 336.0, 452.0, 452.0, 452.0, 0.024752679477553444, 0.02482519709321034, 0.01587330031600921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 834.5384615384617, 99, 1195, 1028.0, 1195.0, 1195.0, 1195.0, 0.07222302470027445, 49.994034221908024, 0.0376848805264503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 186.72222222222226, 97, 760, 102.0, 435.10000000000053, 760.0, 760.0, 0.09287206872533087, 1.5407230316280989, 0.05424591427392101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 626.9999999999999, 98, 907, 786.0, 872.1999999999999, 907.0, 907.0, 0.07222382719615993, 16.340033250738905, 0.037755830337896396], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 477.3571428571429, 104, 1038, 450.0, 965.5, 1038.0, 1038.0, 0.09809073392888422, 0.019322560868803643, 0.06662999211770888], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 264.72727272727275, 204, 612, 204.0, 574.8000000000002, 612.0, 612.0, 0.05596796597147669, 0.08673941601243507, 0.12587326721905354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 688.6521739130433, 189, 1541, 611.0, 1447.8000000000002, 1529.3999999999999, 1541.0, 0.10760938728150617, 0.0660999068360033, 0.048655416319665384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 109.84615384615385, 99, 196, 102.0, 161.59999999999997, 196.0, 196.0, 0.07222061731961511, 0.053671767363503035, 0.03625136455300994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 179.53846153846152, 97, 311, 103.0, 310.2, 311.0, 311.0, 0.0722242284507903, 0.10276978179949443, 0.036524452068113], "isController": false}, {"data": ["login", 23, 0, 0.0, 3243.5217391304345, 1587, 6190, 3034.0, 5182.600000000001, 6036.599999999998, 6190.0, 0.10523377912802374, 43.93100102774511, 0.21947087283412867], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a5118e0-5f80-4897-a594-1c5682f28027", 3, 0, 0.0, 477.6666666666667, 358, 592, 483.0, 592.0, 592.0, 592.0, 0.04003416248532081, 0.02620725936132166, 0.025672949250026687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 109.22222222222223, 102, 120, 107.0, 117.30000000000001, 120.0, 120.0, 0.09763718023823473, 0.07904416251708651, 0.03470696641281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89695d19-5d40-46e3-aa71-8e4d0656799c", 3, 0, 0.0, 396.3333333333333, 255, 605, 329.0, 605.0, 605.0, 605.0, 0.07390072669047912, 0.03430417847025496, 0.04739076548836064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ffdba19-e897-413c-8bf0-9c643030f95a", 3, 0, 0.0, 417.0, 268, 697, 286.0, 697.0, 697.0, 697.0, 0.022828617955468977, 0.026982653579527296, 0.014639445759203739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 945.8461538461538, 199, 1298, 1133.0, 1297.6, 1298.0, 1298.0, 0.07218091869652365, 66.45156369723158, 0.1481302973159803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1676a2ba-a09d-4bfe-b52b-224d371e63a4", 3, 0, 0.0, 524.6666666666666, 313, 901, 360.0, 901.0, 901.0, 901.0, 0.03589761998779481, 0.023078710766892822, 0.02302028365102727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 410.0, 201, 1433, 315.5, 1202.6000000000004, 1433.0, 1433.0, 0.12565971349585323, 16.876743092206304, 0.2790392834952947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 748.5384615384615, 101, 1444, 953.0, 1427.6, 1444.0, 1444.0, 0.12091673487610687, 89.0330301791893, 0.1984426011747526], "isController": false}, {"data": ["register", 24, 9, 37.5, 1499.458333333333, 196, 4691, 1283.5, 2994.0, 4324.0, 4691.0, 0.09554672633028911, 0.02971839095331746, 0.04310799566854841], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 356.05555555555554, 202, 986, 397.5, 549.5000000000007, 986.0, 986.0, 0.09282273950845202, 6.305213213510349, 0.2074410962365536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 111.33333333333334, 101, 124, 108.0, 122.5, 124.0, 124.0, 0.0655569334651756, 0.05089625205548302, 0.023303441192699142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5887792-dffe-4ec0-b3c4-6b69b2d3e900", 3, 0, 0.0, 395.3333333333333, 285, 518, 383.0, 518.0, 518.0, 518.0, 0.028808757862390167, 0.028893158520190136, 0.018474366207327026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35f19b12-e136-4884-be98-9714796f8f1c", 3, 0, 0.0, 585.0, 197, 1044, 514.0, 1044.0, 1044.0, 1044.0, 0.03374616137414369, 0.028132786223692054, 0.021640604787455428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 304.3529411764706, 201, 1010, 208.0, 530.7999999999996, 1010.0, 1010.0, 0.08595365581122555, 6.174225690283698, 0.19201813653738226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 103.72727272727273, 99, 109, 103.0, 108.8, 109.0, 109.0, 0.06130661108200595, 0.04556087014981107, 0.03077304501577252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 134.45454545454547, 97, 286, 103.0, 285.6, 286.0, 286.0, 0.061246875017399685, 0.016388323979265148, 0.034929858408360756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 118.9090909090909, 99, 296, 101.0, 257.60000000000014, 296.0, 296.0, 0.06130968637308617, 0.01652487640524588, 0.036043389840427605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 137.36363636363635, 99, 300, 104.0, 297.6, 300.0, 300.0, 0.06124141924205392, 0.016506476280084847, 0.03606306230757668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.5, 104, 109, 106.5, 109.0, 109.0, 109.0, 0.03017319413433106, 0.008898734988835918, 0.018651984264679258], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1134.821428571429, 765, 1818, 1068.5, 1516.4, 1664.1499999999999, 1818.0, 0.25654886797812004, 306.92163691921456, 0.5065837998552332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1499.458333333333, 196, 4691, 1283.5, 2994.0, 4324.0, 4691.0, 0.09721715882853324, 0.030237954186413903, 0.04386164783084214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 132.6153846153846, 95, 304, 103.0, 300.8, 304.0, 304.0, 0.07229451673896119, 0.019485631464798134, 0.042571868743743746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 115.3076923076923, 96, 297, 101.0, 220.19999999999993, 297.0, 297.0, 0.07229773318799634, 0.01948649839832714, 0.04250315954997441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eadfca1-a56b-4c06-aeae-60fd88ffd9b0", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 239.41666666666669, 98, 967, 104.0, 769.0000000000007, 967.0, 967.0, 0.06468619111535165, 4.8663777434357, 0.0375651578612589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 189.83333333333331, 99, 573, 102.0, 492.9000000000003, 573.0, 573.0, 0.06468549373898325, 1.6009554418019223, 0.037627922301941105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12eb4106-8db8-4296-a787-d16de27ff188", 3, 0, 0.0, 314.0, 225, 488, 229.0, 488.0, 488.0, 488.0, 0.06068574896328512, 0.027458721047840598, 0.0389163168807525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 119.41666666666667, 98, 303, 102.0, 245.70000000000022, 303.0, 303.0, 0.06468549373898325, 0.04807193431188111, 0.03246908572445058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 100.69230769230771, 96, 118, 99.0, 112.0, 118.0, 118.0, 0.07229893943017313, 0.019345614652214294, 0.04123298889377061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 183.16666666666669, 98, 301, 103.5, 301.0, 301.0, 301.0, 0.06468584242528785, 0.02540477502803053, 0.03643842783755229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 102.6923076923077, 98, 110, 102.0, 108.4, 110.0, 110.0, 0.07229491877943933, 0.053726985538235676, 0.036288660402960755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 128.23076923076923, 102, 306, 108.0, 246.39999999999995, 306.0, 306.0, 0.07494782478351608, 0.058992135522962855, 0.026641609591015483], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 668.1428571428571, 104, 2761, 516.0, 1831.0, 2761.0, 2761.0, 0.0990757646525979, 0.019129584023325263, 0.0674234905099571], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1628.0869565217388, 947, 3440, 1438.0, 2715.4000000000015, 3369.399999999999, 3440.0, 0.10501755619580751, 0.05435478982790819, 0.04830397360178256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93044b22-a2b7-4cc2-9766-6f26d6d0249e", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 238.38461538461536, 197, 407, 211.0, 403.4, 407.0, 407.0, 0.07225112267129073, 0.1119751285931039, 0.16249446827342048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b00798a-c14d-4a11-bdb9-f1d1dce59291", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 1040.2280701754385, 512, 2486, 880.0, 1684.0, 1888.5999999999992, 2486.0, 0.2674612298524271, 85.3271799409943, 0.9701884839171339], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59eea8ff-7e4f-4d5d-b291-479a9cd9ce71", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 185.03571428571425, 98, 604, 104.0, 411.3, 416.45, 604.0, 0.25770705150919687, 0.19151861933447156, 0.12457518603227781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a5118e0-5f80-4897-a594-1c5682f28027", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 655.2142857142857, 472, 922, 604.0, 822.8000000000002, 893.05, 922.0, 0.2575221767981716, 75.72007051968895, 0.1295155479014242], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 150.2857142857143, 96, 398, 104.0, 306.3, 355.29999999999995, 398.0, 0.2581251814942682, 0.4567605750660293, 0.12553353553139215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ded8981-39b1-4f4c-8ff1-e95920c54e6c", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 947.6071428571428, 660, 1298, 912.5, 1181.9, 1245.8999999999999, 1298.0, 0.2570812101179819, 231.32212476472478, 0.12904271679750262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 132.58823529411765, 104, 324, 108.0, 296.79999999999995, 324.0, 324.0, 0.09072134139508077, 0.06777522086644218, 0.032248601824032615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, 7.647058823529412, 172.16470588235285, 98, 1863, 110.0, 307.8, 346.69999999999993, 1064.249999999991, 0.7392011409787024, 1.6946678731226466, 0.3524921065819339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 107.36363636363636, 98, 117, 108.0, 116.0, 117.0, 117.0, 0.06061407569044942, 0.046940392600123435, 0.021546409718089445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab267a14-1ab3-4595-acb8-b18eae5e676c", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 111.83333333333334, 101, 159, 108.0, 125.70000000000005, 159.0, 159.0, 0.12436092303440652, 0.1009218037515545, 0.04420642185988669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1676a2ba-a09d-4bfe-b52b-224d371e63a4", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 259.1818181818182, 201, 403, 209.0, 401.6, 403.0, 403.0, 0.0612042776226033, 0.09485467635456195, 0.1376498548484916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6ae0b3b-9d31-4931-b1d4-056c38ab699e", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59eea8ff-7e4f-4d5d-b291-479a9cd9ce71", 3, 0, 0.0, 466.3333333333333, 218, 728, 453.0, 728.0, 728.0, 728.0, 0.03967991534951392, 0.025510362244560544, 0.025445779049004694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 410.5, 203, 1065, 406.5, 925.5000000000005, 1065.0, 1065.0, 0.06464959917248513, 6.5371277681476805, 0.14402002992737695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ffdba19-e897-413c-8bf0-9c643030f95a", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 144.63636363636365, 103, 330, 107.0, 324.8, 330.0, 330.0, 0.05550509637703098, 0.046019362132909476, 0.01973032722777273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 106.15384615384615, 102, 119, 105.0, 114.6, 119.0, 119.0, 0.07405044544191026, 0.05749033606085807, 0.02632261927817904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 105.58823529411765, 99, 128, 104.0, 121.6, 128.0, 128.0, 0.08599800686972313, 0.06391062815220636, 0.043166968292029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 158.8235294117647, 95, 304, 102.0, 298.4, 304.0, 304.0, 0.08600409784230896, 0.030611293096906383, 0.04862432967394329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 160.58823529411765, 98, 909, 101.0, 427.3999999999996, 909.0, 909.0, 0.08600279256126435, 4.573902998019406, 0.05012547870672036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 165.58823529411762, 96, 803, 102.0, 404.5999999999997, 803.0, 803.0, 0.08600409784230896, 1.5093501789644095, 0.050210227847620977], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6870229007633588], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22900763358778625], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.15267175572519084], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.297709923664122], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1310, 31, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

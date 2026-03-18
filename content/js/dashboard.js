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

    var data = {"OkPercent": 98.32444782939832, "KoPercent": 1.6755521706016756};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8134816753926701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f43d00a-b95a-4179-a751-990717c2e4a4"], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d63f048-1092-47ad-9ee3-8f567018507d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47408359-509c-4888-a083-de9d384af899"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e0b7897-0f5d-4d0e-bf89-83dfa9a0f671"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8977a1d2-e790-4d23-90de-1d6601074ece"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f0bf18d-7c74-43eb-9237-4e30dd0a6225"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12f7b0a7-a772-46d5-8a1a-5a432a3c2a99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c11521a5-0e76-4e67-9dcc-45ac89cd15c6"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=157e4d83-1aef-4a74-821b-e722eae2743f"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec948b8f-e98b-4fe6-97c2-4cae52020dd0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8977a1d2-e790-4d23-90de-1d6601074ece"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c11521a5-0e76-4e67-9dcc-45ac89cd15c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e0b7897-0f5d-4d0e-bf89-83dfa9a0f671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00ed2d70-8e04-42a9-bc48-2c982833d4c4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb8558fd-f35a-4a3d-9fc5-05aecfbbbcb3"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ba9b0ea-ff64-46ca-9d2b-f24a64a2f18b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10af9c2b-dcab-4c92-842a-79d94de44cc2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e156be7-dae4-4a6c-b6b5-b48385dcf7dc"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/330ee218-f21c-4a5a-839c-1d08e47dc3ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12f7b0a7-a772-46d5-8a1a-5a432a3c2a99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47408359-509c-4888-a083-de9d384af899"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d63f048-1092-47ad-9ee3-8f567018507d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c3501f4-1f23-4712-af7c-b054d0d59c37"], "isController": false}, {"data": [0.7636363636363637, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9209039548022598, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec948b8f-e98b-4fe6-97c2-4cae52020dd0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/157e4d83-1aef-4a74-821b-e722eae2743f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb8558fd-f35a-4a3d-9fc5-05aecfbbbcb3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00ed2d70-8e04-42a9-bc48-2c982833d4c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10af9c2b-dcab-4c92-842a-79d94de44cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afdebbc5-f947-451b-8c7e-7d6d369893a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e156be7-dae4-4a6c-b6b5-b48385dcf7dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 22, 1.6755521706016756, 308.3099771515614, 95, 1880, 109.0, 800.6000000000001, 970.0999999999997, 1308.7599999999984, 5.111734018531496, 720.5902914647083, 3.725738394699447], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8f43d00a-b95a-4179-a751-990717c2e4a4", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1429.4909090909089, 1187, 1778, 1420.0, 1704.0, 1731.3999999999999, 1778.0, 0.2580826803059453, 310.5607185329759, 1.268990522793393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d63f048-1092-47ad-9ee3-8f567018507d", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47408359-509c-4888-a083-de9d384af899", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 621.923076923077, 111, 1507, 495.0, 1428.6, 1507.0, 1507.0, 0.09648211370046014, 0.018278837947157487, 0.06522254666394538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 621.923076923077, 111, 1507, 495.0, 1428.6, 1507.0, 1507.0, 0.09669165774128288, 0.01831853672051648, 0.06536419982074854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 174.375, 98, 304, 103.0, 302.6, 304.0, 304.0, 0.08329775824908112, 0.03010799098822378, 0.04706852086608844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 118.18749999999997, 97, 356, 102.0, 188.00000000000017, 356.0, 356.0, 0.08338327644161868, 0.06196745446491388, 0.04185449618260938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 185.9375, 97, 684, 101.5, 417.3000000000003, 684.0, 684.0, 0.08330209504769044, 1.5518981000614354, 0.0486064470615186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 187.12500000000003, 96, 704, 100.5, 424.7000000000003, 704.0, 704.0, 0.08338501467055101, 4.71044411151964, 0.048573399659163755], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 187.35714285714286, 101, 243, 186.5, 227.0, 243.0, 243.0, 0.08168885880664246, 0.15137738721102567, 0.052804872667491336], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 101.72222222222223, 98, 106, 102.0, 104.2, 106.0, 106.0, 0.11247820734732646, 0.08358976151495648, 0.056458787672388475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 122.27777777777779, 96, 306, 100.5, 297.0, 306.0, 306.0, 0.11233851338700618, 0.04880679335954566, 0.0630197606565562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 653.4, 479, 713, 689.0, 713.0, 713.0, 713.0, 0.07393606009522964, 21.739656576242865, 0.04216665927306065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e0b7897-0f5d-4d0e-bf89-83dfa9a0f671", 3, 0, 0.0, 528.3333333333334, 208, 975, 402.0, 975.0, 975.0, 975.0, 0.023379234563860377, 0.027633463769979508, 0.014992542998308904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 757.4, 664, 889, 688.0, 889.0, 889.0, 889.0, 0.07393715341959335, 66.52878061460258, 0.04209507855822551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 219.2, 97, 307, 295.0, 307.0, 307.0, 307.0, 0.07458901452994003, 0.13198759211743294, 0.041300753162574214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8977a1d2-e790-4d23-90de-1d6601074ece", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 101.07142857142857, 97, 104, 102.0, 104.0, 104.0, 104.0, 0.08287897893097958, 0.06159267867819869, 0.041601362471214355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 128.42857142857144, 98, 303, 100.0, 300.5, 303.0, 303.0, 0.08287946957139473, 0.031068238663272556, 0.0467700131719157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 184.92857142857142, 96, 879, 101.0, 592.5, 879.0, 879.0, 0.08287897893097958, 5.347503650005033, 0.0482150309908182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f0bf18d-7c74-43eb-9237-4e30dd0a6225", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.6823417467948718, 1.274956597222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 183.21428571428572, 97, 685, 100.5, 493.0, 685.0, 685.0, 0.08287996021761909, 1.7614188420189558, 0.048296539317661126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12f7b0a7-a772-46d5-8a1a-5a432a3c2a99", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.1788753094059406, 0.6826268564356436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 140.0, 98, 302, 99.0, 302.0, 302.0, 302.0, 0.07458678918789904, 0.05543022126171013, 0.0418822302568769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c11521a5-0e76-4e67-9dcc-45ac89cd15c6", 3, 0, 0.0, 752.6666666666666, 203, 1850, 205.0, 1850.0, 1850.0, 1850.0, 0.03273001014630314, 0.027285662755430453, 0.020988971350331117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 505.8421052631577, 98, 917, 688.0, 904.0, 917.0, 917.0, 0.09274898220195847, 43.93589268149511, 0.05033119624220176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 216.44444444444446, 97, 1016, 100.5, 886.4000000000002, 1016.0, 1016.0, 0.11233781228351566, 11.258221041028266, 0.06496967659192042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 422.42105263157896, 99, 795, 486.0, 793.0, 795.0, 795.0, 0.0927485294476581, 14.365076822630641, 0.05042152528617803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 166.44444444444446, 98, 685, 101.5, 521.2000000000003, 685.0, 685.0, 0.11247891020433669, 3.7016741001687183, 0.06516112213335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=157e4d83-1aef-4a74-821b-e722eae2743f", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 471.2307692307693, 108, 1159, 384.0, 1099.3999999999999, 1159.0, 1159.0, 0.09668590468257274, 0.01831744678556554, 0.06613019547286846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec948b8f-e98b-4fe6-97c2-4cae52020dd0", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 315.0, 199, 979, 206.0, 694.0, 979.0, 979.0, 0.08282945415389713, 7.19725903839441, 0.18477161996663158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8977a1d2-e790-4d23-90de-1d6601074ece", 3, 0, 0.0, 501.6666666666667, 181, 1042, 282.0, 1042.0, 1042.0, 1042.0, 0.028999236353442693, 0.029084195053696922, 0.018596515500091833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 373.4347826086956, 105, 894, 289.0, 841.6000000000001, 890.8, 894.0, 0.09812872782504074, 0.060276337697217415, 0.04436875095995495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 111.57894736842104, 97, 296, 102.0, 105.0, 296.0, 296.0, 0.0927485294476581, 0.06892737393522248, 0.04655541419540651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c11521a5-0e76-4e67-9dcc-45ac89cd15c6", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 158.84210526315792, 95, 412, 101.0, 301.0, 412.0, 412.0, 0.09274807669777796, 0.09813486363591988, 0.048795708937009415], "isController": false}, {"data": ["login", 23, 0, 0.0, 1861.4347826086957, 1257, 3128, 1726.0, 2718.6000000000004, 3080.999999999999, 3128.0, 0.09816348915720242, 25.665563627813132, 0.18349386931665407], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e0b7897-0f5d-4d0e-bf89-83dfa9a0f671", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 115.72222222222221, 99, 298, 104.5, 133.30000000000027, 298.0, 298.0, 0.11531882451678209, 0.09335869680118394, 0.040992238402449886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00ed2d70-8e04-42a9-bc48-2c982833d4c4", 3, 0, 0.0, 520.0, 184, 988, 388.0, 988.0, 988.0, 988.0, 0.018979293590692555, 0.026164488397325183, 0.012170966267468858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb8558fd-f35a-4a3d-9fc5-05aecfbbbcb3", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 630.2105263157894, 201, 1018, 807.0, 1011.0, 1018.0, 1018.0, 0.09270282402076543, 58.439005467941904, 0.19600719941109312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ba9b0ea-ff64-46ca-9d2b-f24a64a2f18b", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 380.8125, 200, 809, 398.5, 704.7, 809.0, 809.0, 0.08325354868251258, 6.345974308800421, 0.1859078571837406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 677.8571428571428, 101, 1192, 789.0, 1192.0, 1192.0, 1192.0, 0.1033576469893394, 88.3305294495467, 0.18603799685497446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10af9c2b-dcab-4c92-842a-79d94de44cc2", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e156be7-dae4-4a6c-b6b5-b48385dcf7dc", 3, 0, 0.0, 346.3333333333333, 243, 538, 258.0, 538.0, 538.0, 538.0, 0.062294945803397145, 0.04004964777399393, 0.03994825626064205], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 894.5217391304346, 128, 1660, 862.0, 1518.0, 1637.1999999999996, 1660.0, 0.09886774934016523, 0.031299165212307745, 0.044606347846832366], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 330.6666666666667, 199, 1119, 206.0, 990.3000000000002, 1119.0, 1119.0, 0.11226284474048573, 15.077475005924985, 0.24929026883832903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 130.1875, 100, 306, 105.0, 302.5, 306.0, 306.0, 0.09497352612959138, 0.07373432936818862, 0.03376012061637819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/330ee218-f21c-4a5a-839c-1d08e47dc3ba", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12f7b0a7-a772-46d5-8a1a-5a432a3c2a99", 3, 0, 0.0, 339.0, 176, 639, 202.0, 639.0, 639.0, 639.0, 0.03698635203609868, 0.02377866057008297, 0.023718461429399217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47408359-509c-4888-a083-de9d384af899", 3, 0, 0.0, 272.0, 203, 402, 211.0, 402.0, 402.0, 402.0, 0.06748852695041843, 0.030536800931341673, 0.043278775420678484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 381.2, 203, 991, 395.0, 752.2000000000002, 991.0, 991.0, 0.11342069247113444, 9.210099900000756, 0.25315114583254567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d63f048-1092-47ad-9ee3-8f567018507d", 3, 0, 0.0, 287.3333333333333, 180, 494, 188.0, 494.0, 494.0, 494.0, 0.06012626515682934, 0.0278710291612386, 0.038557533319971936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 101.0, 99, 103, 100.5, 103.0, 103.0, 103.0, 0.04414933069614665, 0.032810195956804296, 0.022160894509589236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 99.69999999999999, 97, 103, 99.5, 102.9, 103.0, 103.0, 0.044150500225167554, 0.011813708068062412, 0.02517958215966587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 118.7, 98, 287, 100.5, 268.50000000000006, 287.0, 287.0, 0.04411388440397731, 0.011890070405759508, 0.02593413907343197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 101.0, 99, 107, 100.0, 106.8, 107.0, 107.0, 0.044150500225167554, 0.011899939513814692, 0.025998780894312533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 2.730758101851852, 5.723741319444445], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 928.2181818181817, 782, 1371, 802.0, 1291.4, 1313.8, 1371.0, 0.2549471332353718, 305.0054053137936, 0.5034209994159393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 894.5217391304346, 128, 1660, 862.0, 1518.0, 1637.1999999999996, 1660.0, 0.09807684107287536, 0.031048782567907555, 0.04424951228092619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 99.62499999999999, 97, 102, 99.5, 102.0, 102.0, 102.0, 0.041510785020833225, 0.011188453775146455, 0.02444433922613519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 148.75, 96, 300, 100.0, 300.0, 300.0, 300.0, 0.041467321159218966, 0.011176738906195737, 0.02437824935336896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 233.375, 99, 887, 102.5, 733.7000000000002, 887.0, 887.0, 0.09428847559107088, 10.627353989139145, 0.05441844636164345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 187.125, 99, 697, 101.0, 691.4, 697.0, 697.0, 0.09439917872714508, 3.4918246992501167, 0.054574525201630746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 124.00000000000001, 98, 293, 100.0, 293.0, 293.0, 293.0, 0.04151056962879173, 0.011107320388954038, 0.023673996741420282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 101.25000000000001, 98, 104, 101.0, 104.0, 104.0, 104.0, 0.0943969509784834, 0.07015242157678306, 0.047382844534121546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 126.375, 98, 295, 102.0, 295.0, 295.0, 295.0, 0.04150798509863335, 0.03084724283208982, 0.020835062832712442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 125.6875, 99, 300, 101.5, 297.9, 300.0, 300.0, 0.09428903123913465, 0.0429318953273892, 0.05278436245882221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.5, 102, 111, 103.0, 111.0, 111.0, 111.0, 0.04307907703077461, 0.033907945397269865, 0.015313265663283162], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 649.6923076923076, 103, 1850, 504.0, 1526.7999999999997, 1850.0, 1850.0, 0.09720716342019665, 0.01821173869966725, 0.06615812053688264], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1020.6521739130434, 629, 1880, 958.0, 1318.6000000000001, 1780.5999999999985, 1880.0, 0.09534350607089412, 0.049347713103099496, 0.0438542884369054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 277.5, 201, 592, 206.0, 592.0, 592.0, 592.0, 0.04144347627879027, 0.06422929380316421, 0.0932073494824746], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 928.8196721311476, 506, 1723, 798.0, 1506.4, 1551.2, 1723.0, 0.2735744974750419, 92.30189551948882, 0.9920272725183206], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 171.7818181818182, 99, 420, 103.0, 404.4, 409.0, 420.0, 0.2559877870553957, 0.19024092377847282, 0.12374409628166103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c3501f4-1f23-4712-af7c-b054d0d59c37", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 573.5454545454546, 474, 801, 499.0, 704.8, 783.0, 801.0, 0.2559318011549504, 75.25244727514064, 0.12871570077617134], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 147.90909090909088, 97, 394, 103.0, 299.4, 311.39999999999986, 394.0, 0.25640188898264393, 0.4537111551138191, 0.12469544991538738], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 751.581818181818, 679, 1004, 695.0, 900.0, 925.5999999999998, 1004.0, 0.2554812337421033, 229.88246320925074, 0.1282396036557042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 121.66666666666669, 100, 360, 103.0, 216.00000000000009, 360.0, 360.0, 0.10990782397162913, 0.08210887240067996, 0.03906879680241504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, 7.344632768361582, 150.4406779661018, 97, 919, 106.0, 275.6, 313.1, 611.6799999999996, 0.7291031619185712, 1.5754876327935772, 0.3511882296180653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 107.5, 98, 142, 102.5, 139.4, 142.0, 142.0, 0.04550149472410169, 0.035236997379113906, 0.016174359452708023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec948b8f-e98b-4fe6-97c2-4cae52020dd0", 3, 0, 0.0, 374.3333333333333, 178, 537, 408.0, 537.0, 537.0, 537.0, 0.033162362928899895, 0.027149525640033603, 0.02126622883135833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/157e4d83-1aef-4a74-821b-e722eae2743f", 3, 0, 0.0, 363.66666666666663, 193, 692, 206.0, 692.0, 692.0, 692.0, 0.06621931838248278, 0.029962517106657247, 0.042464862374183295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 103.1875, 100, 107, 103.0, 106.3, 107.0, 107.0, 0.08131692764318132, 0.06599059264793328, 0.028905626623162112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 222.09999999999997, 199, 387, 203.5, 369.50000000000006, 387.0, 387.0, 0.044093460498873416, 0.06833625176925011, 0.09916722610244674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb8558fd-f35a-4a3d-9fc5-05aecfbbbcb3", 3, 0, 0.0, 454.6666666666667, 186, 984, 194.0, 984.0, 984.0, 984.0, 0.03316639580776757, 0.02764945952594165, 0.021268815019955114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 337.875, 200, 990, 205.5, 854.2000000000002, 990.0, 990.0, 0.09423127889513826, 14.219456274478048, 0.20891461026531996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00ed2d70-8e04-42a9-bc48-2c982833d4c4", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 146.92857142857147, 100, 310, 104.0, 306.0, 310.0, 310.0, 0.08291137366379439, 0.06874194945367328, 0.02947240235705191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10af9c2b-dcab-4c92-842a-79d94de44cc2", 3, 0, 0.0, 290.6666666666667, 176, 504, 192.0, 504.0, 504.0, 504.0, 0.038640374038820695, 0.032212889945774675, 0.024779146112134366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 105.05263157894736, 100, 117, 104.0, 112.0, 117.0, 117.0, 0.09195491305420984, 0.07139077722470394, 0.03268709799973866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afdebbc5-f947-451b-8c7e-7d6d369893a9", 2, 0, 0.0, 309.0, 185, 433, 309.0, 433.0, 433.0, 433.0, 0.017705852669599936, 0.02994778986694052, 0.011005639867383165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e156be7-dae4-4a6c-b6b5-b48385dcf7dc", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 0.15587926013805004, 0.5948689603106125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 114.26666666666668, 99, 296, 102.0, 180.20000000000007, 296.0, 296.0, 0.11350823691439209, 0.08435524247251208, 0.056975814232419465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 125.7333333333333, 97, 301, 99.0, 293.8, 301.0, 301.0, 0.11351081379686105, 0.04173887215655412, 0.06410109367669094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 205.46666666666667, 96, 890, 103.0, 534.2000000000003, 890.0, 890.0, 0.11350737797956867, 6.837496748486568, 0.06607962069617858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 239.86666666666667, 98, 697, 293.0, 523.6000000000001, 697.0, 697.0, 0.11350995482303798, 2.2536012215562975, 0.06619197040038745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.38080731150038083], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07616146230007616], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07616146230007616], "isController": false}, {"data": ["401/Unauthorized", 15, 68.18181818181819, 1.1424219345011424], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 22, "401/Unauthorized", 15, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

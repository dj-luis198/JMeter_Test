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

    var data = {"OkPercent": 97.31743666169896, "KoPercent": 2.682563338301043};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7753856041131105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.034482758620689655, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fa463f70-b1d3-4d6a-af72-f33db24d5594"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10ae5f77-8062-41fc-ade3-3e9725601a8e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10ae5f77-8062-41fc-ade3-3e9725601a8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e682f86-2ff2-4bed-adaa-eeb06e78a946"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d57abdff-a5b7-4015-a869-51a1c0ad4447"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9f16888-21f1-4d6f-9994-359c6e2a1e88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=158827bc-4128-4de7-9f3d-a7fbae1f2f39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/158827bc-4128-4de7-9f3d-a7fbae1f2f39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79494efa-905d-4ebf-bdb8-78e55943b9aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/489ec48f-2d66-4b89-a076-ee670af6daf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a2e7dc-3205-435e-af31-8732f99a21a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88834da6-aee8-41c3-baf6-16a49ee771b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70626de7-01a3-4205-b72e-e78f1f4ae74d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e7ba0a46-5252-4ba6-94b6-1a0dce12fe39"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88834da6-aee8-41c3-baf6-16a49ee771b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=489ec48f-2d66-4b89-a076-ee670af6daf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a2e7dc-3205-435e-af31-8732f99a21a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7ba0a46-5252-4ba6-94b6-1a0dce12fe39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9f16888-21f1-4d6f-9994-359c6e2a1e88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35a9db12-40ca-4d0d-8595-6ab8d9e1822b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70626de7-01a3-4205-b72e-e78f1f4ae74d"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a65bffe-5ecc-4159-ad4e-107835ba60f1"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa463f70-b1d3-4d6a-af72-f33db24d5594"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a65bffe-5ecc-4159-ad4e-107835ba60f1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 36, 2.682563338301043, 362.1587183308495, 1, 2421, 117.0, 1012.1000000000001, 1293.6999999999998, 1645.6999999999994, 5.355510948468172, 748.2577348373593, 3.9240639266729986], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1838.3275862068965, 1322, 2425, 1831.0, 2168.0, 2226.4499999999994, 2425.0, 0.24951924524730365, 300.2560168621772, 1.2268841795118888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 114.22222222222223, 106, 124, 112.5, 122.2, 124.0, 124.0, 0.08844426537210469, 0.06866522555744455, 0.03143917245649033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 278.62500000000006, 215, 452, 223.0, 452.0, 452.0, 452.0, 0.11549011115923198, 0.1789871156344738, 0.25973996679659306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa463f70-b1d3-4d6a-af72-f33db24d5594", 3, 0, 0.0, 1043.0, 282, 2421, 426.0, 2421.0, 2421.0, 2421.0, 0.07814535035165408, 0.035358735998958064, 0.050112740948163585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 424.0, 222, 1430, 438.0, 812.3999999999994, 1430.0, 1430.0, 0.1037205159180486, 7.45045534069139, 0.23170882028590256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10ae5f77-8062-41fc-ade3-3e9725601a8e", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10ae5f77-8062-41fc-ade3-3e9725601a8e", 3, 0, 0.0, 452.33333333333337, 227, 900, 230.0, 900.0, 900.0, 900.0, 0.02108562873830626, 0.024922499332288427, 0.013521708533353952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e682f86-2ff2-4bed-adaa-eeb06e78a946", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 143.14285714285714, 107, 331, 113.0, 331.0, 331.0, 331.0, 0.07085163667280714, 0.052654390144537336, 0.035564200439280144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 173.57142857142858, 105, 339, 112.0, 339.0, 339.0, 339.0, 0.07069350326704976, 0.049252700239348, 0.038621060099576845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 485.1428571428571, 105, 1290, 318.0, 1290.0, 1290.0, 1290.0, 0.0706920754183456, 18.187568009563627, 0.03982346547702002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 408.7142857142858, 109, 972, 113.0, 972.0, 972.0, 972.0, 0.07053962815538872, 8.899861282561597, 0.03894047274147226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 113.66666666666667, 112, 115, 114.0, 115.0, 115.0, 115.0, 0.10331290033748881, 0.030469234279220332, 0.0638643221812797], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1283.4999999999998, 843, 1983, 1223.0, 1686.7, 1780.2999999999997, 1983.0, 0.24986537425955846, 298.9258548734518, 0.49338651050080773], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 426.15384615384613, 112, 735, 474.0, 669.4, 735.0, 735.0, 0.0695596340093103, 0.014401017978490022, 0.04651068977740917], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 426.15384615384613, 112, 735, 474.0, 669.4, 735.0, 735.0, 0.06889826376375315, 0.014264093669839521, 0.046068467980856884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 684.6086956521741, 121, 1843, 596.0, 1333.4, 1745.3999999999987, 1843.0, 0.09384231227457444, 0.029134467873288397, 0.042339011983255265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 108.50000000000001, 104, 113, 109.0, 112.8, 113.0, 113.0, 0.04596961408508976, 0.012390247546371849, 0.02706999735674719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 148.91304347826087, 105, 343, 112.0, 331.8, 341.0, 343.0, 0.10611841892783486, 0.02839496756467456, 0.06052066079478082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d57abdff-a5b7-4015-a869-51a1c0ad4447", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 133.5, 108, 331, 111.5, 309.4000000000001, 331.0, 331.0, 0.04596813488889502, 0.012389848856772485, 0.027024235549916797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 139.65217391304347, 105, 340, 113.0, 321.0, 336.99999999999994, 340.0, 0.10622477161674101, 0.07894243281283196, 0.05331985606543446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 148.39130434782604, 106, 339, 110.0, 332.6, 337.79999999999995, 339.0, 0.10611841892783486, 0.02860223010164299, 0.06248965489598088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9f16888-21f1-4d6f-9994-359c6e2a1e88", 3, 0, 0.0, 339.6666666666667, 227, 528, 264.0, 528.0, 528.0, 528.0, 0.023345576791383927, 0.027593681422368177, 0.014970959075203885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 165.34782608695653, 103, 338, 112.0, 330.8, 336.79999999999995, 338.0, 0.10623114974435242, 0.028632614579532492, 0.06245229701767594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 176.33333333333331, 104, 429, 113.0, 342.60000000000014, 429.0, 429.0, 0.08864593336780675, 0.023892849228041663, 0.05211411317130826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 164.44444444444446, 106, 429, 112.0, 348.0000000000001, 429.0, 429.0, 0.08864462370357237, 0.023892496232603495, 0.0521999102473185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 155.40000000000003, 106, 338, 112.0, 337.9, 338.0, 338.0, 0.0459675009768094, 0.012299897722310327, 0.02621584040083661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 123.83333333333334, 108, 340, 111.0, 137.5000000000003, 340.0, 340.0, 0.08864287754478928, 0.06587620098787562, 0.044494569392599305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 131.60000000000002, 105, 329, 108.5, 307.6000000000001, 329.0, 329.0, 0.045968346196808875, 0.03416202290602691, 0.023073955024570082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 132.11111111111111, 104, 318, 110.0, 315.3, 318.0, 318.0, 0.08864506025401735, 0.023719479013281985, 0.05055538592611927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 133.79999999999998, 111, 312, 114.5, 292.4000000000001, 312.0, 312.0, 0.04537040397807702, 0.03571147031868172, 0.01612776078908207], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 548.1538461538461, 110, 2275, 430.0, 1724.9999999999995, 2275.0, 2275.0, 0.0709564382051296, 0.014242458149346927, 0.048281506705383406], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 972.9047619047619, 764, 1612, 864.0, 1326.8000000000002, 1586.2999999999997, 1612.0, 0.09183419118129381, 0.04753136848250559, 0.042240140670302136], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 363.84615384615387, 109, 2421, 207.0, 1558.1999999999991, 2421.0, 2421.0, 0.06938106750777868, 0.1449226234315876, 0.044838140307198016], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 289.7, 220, 666, 225.0, 643.7, 666.0, 666.0, 0.045944269600974016, 0.0712046443913533, 0.10332973915140933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=158827bc-4128-4de7-9f3d-a7fbae1f2f39", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 110.0625, 103, 115, 110.5, 114.3, 115.0, 115.0, 0.11558188253991186, 0.08589630137975872, 0.0580166871342917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 136.0, 103, 337, 110.0, 321.6, 337.0, 337.0, 0.11558188253991186, 0.030927183413999856, 0.06591779238604348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 1, 14.285714285714286, 619.4285714285714, 1, 882, 674.0, 882.0, 882.0, 882.0, 0.04127893948507472, 10.41456471174032, 0.020178767292927148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1130.7142857142856, 785, 1396, 1148.0, 1396.0, 1396.0, 1396.0, 0.041262879913230056, 37.1284118783305, 0.023492440419348753], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1058.6166666666666, 553, 2832, 883.0, 1919.0, 2077.85, 2832.0, 0.284598928959364, 76.24780047273067, 1.0369702902434743], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 236.14285714285714, 111, 341, 319.0, 341.0, 341.0, 341.0, 0.04140884729600228, 0.07327424931675403, 0.02292853165706376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 110.54545454545453, 107, 115, 110.0, 114.8, 115.0, 115.0, 0.06980891396368667, 0.05187947609996636, 0.03504080251692866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 148.0, 104, 329, 109.0, 328.4, 329.0, 329.0, 0.06981290142418319, 0.01868040526389277, 0.03981517034347948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 108.45454545454545, 104, 114, 109.0, 113.8, 114.0, 114.0, 0.06980935699235905, 0.018815803251846775, 0.04104026651308608], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 210.8103448275862, 105, 675, 115.0, 444.1, 454.15, 675.0, 0.25065797719012406, 0.18628000062664496, 0.12116767452061662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 149.45454545454547, 106, 337, 111.0, 332.8, 337.0, 337.0, 0.06971953731579782, 0.01879159404214863, 0.041055547852955156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/158827bc-4128-4de7-9f3d-a7fbae1f2f39", 3, 0, 0.0, 285.6666666666667, 210, 430, 217.0, 430.0, 430.0, 430.0, 0.016093470878864445, 0.022186148819007462, 0.010320357301875962], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 701.7931034482759, 512, 1094, 651.5, 902.8000000000001, 980.6999999999999, 1094.0, 0.25087047730270984, 73.76425001081338, 0.1261702107528277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 174.7142857142857, 110, 328, 115.0, 328.0, 328.0, 328.0, 0.04146403587231447, 0.03081458134651495, 0.023283027955645328], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 170.3620689655172, 104, 449, 113.0, 337.0, 341.1, 449.0, 0.2513118042887659, 0.44470409118285537, 0.1222199985701225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 891.9375000000002, 109, 1640, 1100.0, 1510.5000000000002, 1640.0, 1640.0, 0.07389173936536232, 41.56241665531351, 0.0394714662430207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 150.5625, 105, 339, 109.5, 336.9, 339.0, 339.0, 0.11558271749416668, 0.031153154324599613, 0.06794999602684408], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1070.9310344827584, 734, 1462, 1079.5, 1308.2, 1335.1499999999996, 1462.0, 0.2506308984685588, 225.51812300413542, 0.1258049627078508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 580.5, 107, 996, 748.0, 953.3000000000001, 996.0, 996.0, 0.0739597104477336, 13.599107023167878, 0.03958000129429493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 113.52941176470588, 111, 116, 113.0, 116.0, 116.0, 116.0, 0.10460251046025104, 0.07814543017782426, 0.03718292364016736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 137.0625, 104, 324, 111.0, 318.4, 324.0, 324.0, 0.1155843874388667, 0.03115360442688204, 0.06806385315003577], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 414.30769230769226, 112, 915, 441.0, 838.5999999999999, 915.0, 915.0, 0.06890593280081415, 0.014265681400168553, 0.04637381700439407], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 159.8707865168539, 105, 1062, 115.0, 266.9, 327.04999999999995, 612.4900000000046, 0.7430195814879593, 1.5782766106932207, 0.35630469594636904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 113.14285714285714, 106, 120, 113.0, 120.0, 120.0, 120.0, 0.07479591400606916, 0.057923007623840665, 0.026587610056844898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79494efa-905d-4ebf-bdb8-78e55943b9aa", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 301.1818181818182, 219, 448, 226.0, 446.8, 448.0, 448.0, 0.06966919798085998, 0.1079736496051023, 0.15668765913078175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 124.26086956521739, 108, 321, 115.0, 130.60000000000002, 284.59999999999945, 321.0, 0.10765723807696088, 0.08736637191597119, 0.03826878384766969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/489ec48f-2d66-4b89-a076-ee670af6daf1", 3, 0, 0.0, 312.6666666666667, 207, 431, 300.0, 431.0, 431.0, 431.0, 0.016885711873469732, 0.023278316987026145, 0.010828402470942505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a2e7dc-3205-435e-af31-8732f99a21a2", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88834da6-aee8-41c3-baf6-16a49ee771b7", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70626de7-01a3-4205-b72e-e78f1f4ae74d", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7ba0a46-5252-4ba6-94b6-1a0dce12fe39", 3, 0, 0.0, 1134.0, 202, 2275, 925.0, 2275.0, 2275.0, 2275.0, 0.06699868235924693, 0.030315159010206132, 0.0429646498202202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 356.5714285714286, 133, 663, 380.0, 632.6, 660.0999999999999, 663.0, 0.09159266560826253, 0.05626151041757532, 0.041413480641235886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 137.5625, 103, 343, 112.0, 325.5, 343.0, 343.0, 0.07396210366713354, 0.05496597743231312, 0.037125509067291645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 176.3125, 104, 338, 112.0, 334.5, 338.0, 338.0, 0.07389276312751121, 0.08913675356763497, 0.03826331801597931], "isController": false}, {"data": ["login", 21, 1, 4.761904761904762, 2058.333333333333, 1155, 3201, 2089.0, 2922.2000000000003, 3179.7, 3201.0, 0.0939164501370733, 36.27197078918887, 0.19106040476871955], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 663.8571428571429, 219, 1405, 657.0, 1405.0, 1405.0, 1405.0, 0.07046294152582466, 27.12026018755725, 0.15245671876730116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88834da6-aee8-41c3-baf6-16a49ee771b7", 3, 0, 0.0, 285.3333333333333, 217, 419, 220.0, 419.0, 419.0, 419.0, 0.019292852641191526, 0.02659675486179887, 0.012372044174201598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 141.99999999999997, 110, 345, 116.0, 325.40000000000003, 345.0, 345.0, 0.1203939893300827, 0.09746739956507672, 0.042796300894677834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 326.72222222222223, 219, 658, 226.5, 553.6000000000001, 658.0, 658.0, 0.08859401301347614, 0.1373034166527213, 0.19925001168948783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=489ec48f-2d66-4b89-a076-ee670af6daf1", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a2e7dc-3205-435e-af31-8732f99a21a2", 3, 0, 0.0, 316.0, 199, 483, 266.0, 483.0, 483.0, 483.0, 0.029818405908020155, 0.024858378102356648, 0.019121829309505116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7ba0a46-5252-4ba6-94b6-1a0dce12fe39", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9f16888-21f1-4d6f-9994-359c6e2a1e88", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 113.63636363636361, 109, 119, 114.0, 118.2, 119.0, 119.0, 0.0668510134005895, 0.055426279665137204, 0.023763446169740802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1030.75, 220, 1749, 1214.0, 1618.1000000000001, 1749.0, 1749.0, 0.07385524372230427, 55.265765281688516, 0.1542918263016987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35a9db12-40ca-4d0d-8595-6ab8d9e1822b", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 116.00000000000001, 106, 139, 115.0, 126.4, 139.0, 139.0, 0.07649134213621196, 0.059385368162391115, 0.027190281774981593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70626de7-01a3-4205-b72e-e78f1f4ae74d", 3, 0, 0.0, 293.6666666666667, 204, 427, 250.0, 427.0, 427.0, 427.0, 0.021725748633088314, 0.0299506983922946, 0.013932202085671868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 347.47826086956525, 214, 671, 229.0, 658.0, 668.8, 671.0, 0.10606116501272735, 0.16437409069843584, 0.23853404592217878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a65bffe-5ecc-4159-ad4e-107835ba60f1", 3, 0, 0.0, 916.6666666666666, 239, 2040, 471.0, 2040.0, 2040.0, 2040.0, 0.03400666530640005, 0.028349957633362805, 0.021807659717971387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 754.6153846153845, 109, 1507, 901.0, 1494.2, 1507.0, 1507.0, 0.07657869934024505, 47.61950810151096, 0.11303872010485391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa463f70-b1d3-4d6a-af72-f33db24d5594", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 124.88235294117646, 106, 327, 113.0, 158.99999999999986, 327.0, 327.0, 0.10456133444865424, 0.07770622608928307, 0.05248488858067214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 135.11764705882354, 104, 331, 111.0, 321.4, 331.0, 331.0, 0.1044238872713424, 0.03716741759726778, 0.05903836733252251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 268.94117647058823, 104, 1317, 111.0, 532.9999999999993, 1317.0, 1317.0, 0.10379524251453133, 5.5201622735584674, 0.06049554977897719], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 684.6086956521741, 121, 1843, 596.0, 1333.4, 1745.3999999999987, 1843.0, 0.09267392478100749, 0.02877172800606007, 0.04181186840705611], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 230.58823529411762, 107, 653, 115.0, 398.5999999999998, 653.0, 653.0, 0.10421775380088277, 1.8289952374019127, 0.06084357949668955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a65bffe-5ecc-4159-ad4e-107835ba60f1", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6706408345752608], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.22354694485842028], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 2.7777777777777777, 0.07451564828614009], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22354694485842028], "isController": false}, {"data": ["401/Unauthorized", 19, 52.77777777777778, 1.4157973174366616], "isController": false}, {"data": ["Assertion failed", 1, 2.7777777777777777, 0.07451564828614009], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 36, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "Assertion failed", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

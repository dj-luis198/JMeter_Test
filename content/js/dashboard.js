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

    var data = {"OkPercent": 98.01762114537445, "KoPercent": 1.9823788546255507};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8164357682619647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10217f33-3ab7-430f-a93b-096334bcc6cf"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12ad1d97-fb0b-444f-a031-9061dfe6efa4"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8163b65-b1ad-4bd9-aaa7-9cb5804d454d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c477fc1a-66cc-4720-82df-40ea17441599"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bc00152-b6c3-464d-babf-c7382cd1ff5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a4f951a-d2b1-4f96-a85a-08aedee8417e"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80c4f852-625f-4a92-83d8-694303a61fae"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3a071f5-948e-4f14-99e4-ceb43d7bdd28"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80c4f852-625f-4a92-83d8-694303a61fae"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebca7599-4a6b-4ad9-b235-4aef5a41af9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f670c0a-6c25-4986-b8bd-b2e5d36c4d71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/783c92c1-93a1-4158-8f9c-9dbc82513027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8163b65-b1ad-4bd9-aaa7-9cb5804d454d"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9b795aa7-7be2-4500-8dc9-9e1de26fb2e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cc06f07-661a-4f7d-8e27-02dc76e07d2a"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=101d70b3-4772-460a-84d7-10d832420427"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=619970fd-d537-4055-9531-7a0c6ead8b14"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cc06f07-661a-4f7d-8e27-02dc76e07d2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c477fc1a-66cc-4720-82df-40ea17441599"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bc00152-b6c3-464d-babf-c7382cd1ff5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79314b96-1af5-4ec1-bb34-37b69726f54b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f670c0a-6c25-4986-b8bd-b2e5d36c4d71"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9175824175824175, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10217f33-3ab7-430f-a93b-096334bcc6cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3a071f5-948e-4f14-99e4-ceb43d7bdd28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a4f951a-d2b1-4f96-a85a-08aedee8417e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/619970fd-d537-4055-9531-7a0c6ead8b14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ad1d97-fb0b-444f-a031-9061dfe6efa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c7e1549-f27b-42a9-9ff2-3599bef463b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b795aa7-7be2-4500-8dc9-9e1de26fb2e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/101d70b3-4772-460a-84d7-10d832420427"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1362, 27, 1.9823788546255507, 292.40969162995606, 78, 2573, 91.0, 806.7, 957.0, 1459.2199999999993, 5.288909599254427, 737.4121882523688, 3.863064640610438], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/10217f33-3ab7-430f-a93b-096334bcc6cf", 3, 0, 0.0, 262.3333333333333, 172, 439, 176.0, 439.0, 439.0, 439.0, 0.020736562707365628, 0.024509915101056184, 0.013297860850752047], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1329.2586206896547, 960, 1699, 1293.5, 1623.0, 1670.15, 1699.0, 0.2578029851807732, 310.223245265926, 1.2676152640480403], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12ad1d97-fb0b-444f-a031-9061dfe6efa4", 3, 0, 0.0, 255.33333333333331, 168, 414, 184.0, 414.0, 414.0, 414.0, 0.0495523768623435, 0.03185740374450794, 0.03177675208945856], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 570.5625, 83, 1343, 515.0, 1033.6000000000004, 1343.0, 1343.0, 0.08489144506462361, 0.016549272188501454, 0.05719188053120822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 570.5625, 83, 1343, 515.0, 1033.6000000000004, 1343.0, 1343.0, 0.0850851117007982, 0.01658702678053891, 0.057322354916590004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 110.125, 79, 240, 81.0, 238.6, 240.0, 240.0, 0.10259698621352999, 0.04671469220904136, 0.05743527572940045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8163b65-b1ad-4bd9-aaa7-9cb5804d454d", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 91.31249999999999, 80, 237, 81.5, 130.6000000000001, 237.0, 237.0, 0.10249314577087656, 0.07616922258948933, 0.05144675481077203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 171.8125, 79, 679, 81.0, 646.1, 679.0, 679.0, 0.10259567046270647, 3.795012848504668, 0.05931312198625218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 193.75000000000003, 79, 859, 81.0, 818.4000000000001, 859.0, 859.0, 0.10259567046270647, 11.56366672517826, 0.059212930901815945], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 221.625, 80, 459, 197.0, 364.5000000000001, 459.0, 459.0, 0.08545821627338084, 0.15331258245382587, 0.05523696962494525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c477fc1a-66cc-4720-82df-40ea17441599", 1, 0, 0.0, 871.0, 871, 871, 871.0, 871.0, 871.0, 871.0, 1.1481056257175661, 0.20742142652123996, 0.7915650114810563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bc00152-b6c3-464d-babf-c7382cd1ff5c", 3, 0, 0.0, 348.66666666666663, 169, 621, 256.0, 621.0, 621.0, 621.0, 0.05064487811466, 0.032889496041258695, 0.03247734696805996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 99.99999999999999, 80, 239, 81.0, 238.2, 239.0, 239.0, 0.08875662411569687, 0.06596073335160675, 0.044551664839324406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 99.7058823529412, 79, 246, 81.0, 241.2, 246.0, 246.0, 0.08875755091811854, 0.023749579054262192, 0.05061954075798949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 568.8, 471, 640, 627.0, 640.0, 640.0, 640.0, 0.02769101260494894, 8.142077134007886, 0.015792530626259942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 897.0, 860, 957, 865.0, 957.0, 957.0, 957.0, 0.02761942639975253, 24.852008424270295, 0.015724732022515356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 143.8, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.027727098802743873, 0.04906396780329287, 0.015352797872222438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 94.58333333333333, 80, 239, 81.0, 193.70000000000016, 239.0, 239.0, 0.07139839710598497, 0.05306072284927203, 0.03583864854734011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 120.16666666666667, 80, 241, 81.0, 240.1, 241.0, 241.0, 0.07133218805542511, 0.028015066695595833, 0.04018240606442485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 192.33333333333331, 79, 944, 81.5, 732.8000000000008, 944.0, 944.0, 0.07103407859920796, 5.343932811010874, 0.04125156126985255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 167.33333333333334, 79, 474, 89.5, 403.80000000000024, 474.0, 474.0, 0.07123225871556366, 1.7629868094180918, 0.041436212996325605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.4, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.02775110588156938, 0.020623624585814744, 0.015582896369045307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a4f951a-d2b1-4f96-a85a-08aedee8417e", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 537.4117647058823, 79, 1032, 786.0, 1025.6, 1032.0, 1032.0, 0.07905064821531536, 37.6670389966729, 0.042876621119543185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 100.58823529411765, 80, 245, 81.0, 241.0, 245.0, 245.0, 0.08875801432658773, 0.023923058548963098, 0.052180004516216606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 368.235294117647, 79, 636, 475.0, 635.2, 636.0, 636.0, 0.07910840177761232, 12.32441461236883, 0.04298520062123362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 119.0, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.08875801432658773, 0.023923058548963098, 0.05226668226458241], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 491.2666666666667, 82, 1032, 438.0, 935.4000000000001, 1032.0, 1032.0, 0.07971684576384683, 0.015616405527566086, 0.054203303200365635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/80c4f852-625f-4a92-83d8-694303a61fae", 3, 0, 0.0, 326.0, 199, 493, 286.0, 493.0, 493.0, 493.0, 0.018321505783488658, 0.025257674802433096, 0.011749142706208549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 315.33333333333337, 161, 1184, 250.0, 925.4000000000009, 1184.0, 1184.0, 0.07099919534245279, 7.179175390569532, 0.15816503688999858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3a071f5-948e-4f14-99e4-ceb43d7bdd28", 3, 0, 0.0, 321.6666666666667, 175, 469, 321.0, 469.0, 469.0, 469.0, 0.02621873415951478, 0.026295546857247734, 0.016813446059324257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 494.09090909090907, 130, 1480, 431.5, 1142.8999999999996, 1454.9499999999996, 1480.0, 0.09522407957270358, 0.05849213481565484, 0.0430554187911736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 83.23529411764707, 80, 97, 81.0, 95.4, 97.0, 97.0, 0.079101776067525, 0.05878559725330715, 0.03970538369014438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 129.0, 79, 266, 81.0, 248.39999999999998, 266.0, 266.0, 0.07905028062849623, 0.0840090872947599, 0.04156860459979633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80c4f852-625f-4a92-83d8-694303a61fae", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["login", 22, 0, 0.0, 2312.1363636363635, 1285, 3658, 2342.0, 2977.4, 3556.8999999999987, 3658.0, 0.09846925073851938, 26.909262298865368, 0.18567887834571659], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ebca7599-4a6b-4ad9-b235-4aef5a41af9a", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.8125596374045801, 1.5182689249363868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 86.52941176470588, 81, 124, 83.0, 102.39999999999998, 124.0, 124.0, 0.08630887407535272, 0.06987310215670645, 0.030680107581473038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f670c0a-6c25-4986-b8bd-b2e5d36c4d71", 3, 0, 0.0, 310.3333333333333, 254, 399, 278.0, 399.0, 399.0, 399.0, 0.03102603083987466, 0.025865125319309568, 0.019896250245622745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/783c92c1-93a1-4158-8f9c-9dbc82513027", 2, 0, 0.0, 255.0, 186, 324, 255.0, 324.0, 324.0, 324.0, 0.01956392021833335, 0.027492657416193056, 0.012160581268524586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8163b65-b1ad-4bd9-aaa7-9cb5804d454d", 3, 0, 0.0, 323.3333333333333, 180, 481, 309.0, 481.0, 481.0, 481.0, 0.03580379520229144, 0.029848150883160278, 0.022960116063969447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 622.0588235294117, 162, 1114, 869.0, 1109.2, 1114.0, 1114.0, 0.07901390644753477, 50.10191559339444, 0.16700130169601027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b795aa7-7be2-4500-8dc9-9e1de26fb2e5", 3, 0, 0.0, 700.6666666666667, 195, 1607, 300.0, 1607.0, 1607.0, 1607.0, 0.033342224593224855, 0.027101411070729973, 0.021381569807504223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cc06f07-661a-4f7d-8e27-02dc76e07d2a", 3, 0, 0.0, 312.0, 222, 456, 258.0, 456.0, 456.0, 456.0, 0.06911646123718465, 0.030598433360211955, 0.04432273067618938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 597.3333333333334, 80, 1039, 942.0, 1039.0, 1039.0, 1039.0, 0.049692458893293726, 33.03338556792959, 0.07688419828119306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 315.81249999999994, 162, 942, 165.0, 901.4000000000001, 942.0, 942.0, 0.10243933670529483, 15.458048390581984, 0.2271122110890582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=101d70b3-4772-460a-84d7-10d832420427", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=619970fd-d537-4055-9531-7a0c6ead8b14", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 924.2608695652173, 168, 1683, 912.0, 1456.6000000000004, 1652.9999999999995, 1683.0, 0.09723513993404921, 0.030633693032890843, 0.04386976039993236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cc06f07-661a-4f7d-8e27-02dc76e07d2a", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 230.41176470588235, 162, 484, 166.0, 480.8, 484.0, 484.0, 0.08871864187415521, 0.13749656704519955, 0.19953030491814402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 108.88235294117646, 81, 344, 83.0, 260.79999999999995, 344.0, 344.0, 0.09103663956987865, 0.0706778598223179, 0.0323606804721053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 304.1764705882353, 162, 950, 172.0, 883.5999999999999, 950.0, 950.0, 0.0895835419224628, 12.731098572525783, 0.19877892198063943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c477fc1a-66cc-4720-82df-40ea17441599", 3, 0, 0.0, 269.0, 181, 406, 220.0, 406.0, 406.0, 406.0, 0.05082678232583356, 0.03267672366325562, 0.032593997780563835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 98.11111111111111, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.04367024115677617, 0.032454153828424474, 0.02192041401814741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 80.22222222222223, 78, 85, 80.0, 85.0, 85.0, 85.0, 0.043670876862684206, 0.011685371348022923, 0.02490604696074959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 114.88888888888889, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.04363784467836484, 0.011761762823465523, 0.025654279781616832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bc00152-b6c3-464d-babf-c7382cd1ff5c", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 132.44444444444446, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.04363742151324881, 0.011761648767242842, 0.025696645676258817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.5, 82, 91, 86.5, 91.0, 91.0, 91.0, 0.23070711731456917, 0.06804057561425769, 0.14261484888683815], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 908.7758620689654, 630, 1359, 867.5, 1278.3, 1325.45, 1359.0, 0.2678080831867315, 320.39157264525124, 0.5288163517612998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 924.2608695652173, 168, 1683, 912.0, 1456.6000000000004, 1652.9999999999995, 1683.0, 0.0931702179372924, 0.029353049299197926, 0.042035781920926836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 91.8, 79, 239, 81.0, 146.00000000000006, 239.0, 239.0, 0.07047050809236334, 0.01899400413426981, 0.041497769902046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 112.66666666666667, 79, 241, 81.0, 240.4, 241.0, 241.0, 0.0704185679680018, 0.018980004647625486, 0.04139841593431356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 182.7058823529412, 80, 869, 81.0, 744.9999999999999, 869.0, 869.0, 0.09123206216660047, 9.679434599357082, 0.05271209106569782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 164.29411764705878, 79, 634, 81.0, 632.4, 634.0, 634.0, 0.09130801415811325, 3.1802547762147997, 0.05284514261506153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79314b96-1af5-4ec1-bb34-37b69726f54b", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 128.4, 79, 480, 81.0, 336.6000000000001, 480.0, 480.0, 0.07041889855453473, 0.018842556839787618, 0.0401607780818831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 90.94117647058823, 79, 238, 82.0, 114.7999999999999, 238.0, 238.0, 0.09130703332706716, 0.06785610582216613, 0.045831850713000506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 103.59999999999998, 81, 251, 82.0, 243.20000000000002, 251.0, 251.0, 0.0704708391667528, 0.05237139512294812, 0.03537305794112396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 118.52941176470586, 79, 249, 81.0, 244.2, 249.0, 249.0, 0.09130801415811325, 0.04056618689676286, 0.05117193164789482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 128.59999999999997, 81, 249, 90.0, 244.8, 249.0, 249.0, 0.06936352033738416, 0.054596677140558235, 0.024656563869929527], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 504.14285714285717, 80, 1607, 455.0, 1114.0, 1607.0, 1607.0, 0.07806053036554632, 0.015071955081740526, 0.053122107578562346], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1387.227272727273, 738, 2573, 1329.5, 2105.5, 2506.699999999999, 2573.0, 0.09608707235793308, 0.04973256674775833, 0.044196299883385234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 244.33333333333337, 162, 562, 165.0, 520.0, 562.0, 562.0, 0.07039114010183252, 0.10909251888828926, 0.15831132388136746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f670c0a-6c25-4986-b8bd-b2e5d36c4d71", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 858.7903225806452, 413, 1808, 695.5, 1532.6000000000001, 1660.3999999999996, 1808.0, 0.2837009243159147, 88.65909487393613, 1.0310746530955432], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 135.58620689655166, 80, 379, 82.0, 324.2, 327.15, 379.0, 0.26878356898237615, 0.19975028905819164, 0.1299295572717541], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 509.1896551724137, 394, 794, 472.5, 709.7, 722.05, 794.0, 0.26873624464265033, 79.01737880806209, 0.13515543553805168], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 111.98275862068967, 78, 325, 82.0, 240.1, 249.59999999999985, 325.0, 0.26882343398762487, 0.4756914671734143, 0.13073639660726288], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 771.6551724137928, 547, 1041, 782.0, 957.4, 1024.55, 1041.0, 0.2682502682502682, 241.37206290526603, 0.1346490604303104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 93.3529411764706, 80, 239, 83.0, 123.7999999999999, 239.0, 239.0, 0.09068020824443117, 0.06774449151073227, 0.03223398027438764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, 7.142857142857143, 144.40109890109892, 80, 1463, 86.0, 252.50000000000009, 376.7, 823.0699999999904, 0.7666224384490639, 1.6153336334533814, 0.3687535869611002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 85.0, 82, 96, 83.0, 96.0, 96.0, 96.0, 0.04354705259032385, 0.03372344990637384, 0.01547961635046668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10217f33-3ab7-430f-a93b-096334bcc6cf", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3a071f5-948e-4f14-99e4-ceb43d7bdd28", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a4f951a-d2b1-4f96-a85a-08aedee8417e", 3, 0, 0.0, 300.0, 220, 454, 226.0, 454.0, 454.0, 454.0, 0.03730137020366548, 0.031096617542834406, 0.023920475032949542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 94.625, 81, 243, 84.0, 138.7000000000001, 243.0, 243.0, 0.1063992498852883, 0.08634548501433065, 0.037821608357661074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/619970fd-d537-4055-9531-7a0c6ead8b14", 3, 0, 0.0, 295.3333333333333, 193, 500, 193.0, 500.0, 500.0, 500.0, 0.061193268740438546, 0.039341375573686894, 0.039241777154513005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 232.33333333333334, 160, 477, 164.0, 477.0, 477.0, 477.0, 0.043620078806942374, 0.06760260260411871, 0.09810257958241045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 321.70588235294116, 163, 953, 317.0, 951.4, 953.0, 953.0, 0.09119144302412281, 12.959604244224096, 0.20234672964687456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ad1d97-fb0b-444f-a031-9061dfe6efa4", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 86.41666666666667, 81, 103, 83.5, 101.2, 103.0, 103.0, 0.06856241751084144, 0.05684520748701599, 0.024371796849556916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c7e1549-f27b-42a9-9ff2-3599bef463b0", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.6105849665391969, 1.1408789435946463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 86.6470588235294, 81, 107, 84.0, 101.39999999999999, 107.0, 107.0, 0.0795623136720816, 0.06176956969658677, 0.02828191618812275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b795aa7-7be2-4500-8dc9-9e1de26fb2e5", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/101d70b3-4772-460a-84d7-10d832420427", 2, 0, 0.0, 434.0, 409, 459, 434.0, 459.0, 459.0, 459.0, 0.029110810299404682, 0.033517231780271606, 0.018094756597237385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 82.1764705882353, 80, 87, 81.0, 87.0, 87.0, 87.0, 0.08962274097973472, 0.06660440027888488, 0.0449864149058434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 133.64705882352942, 79, 321, 82.0, 257.79999999999995, 321.0, 321.0, 0.0896232134666786, 0.03981766618516156, 0.0502277154515692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 187.94117647058826, 79, 868, 81.0, 803.1999999999999, 868.0, 868.0, 0.0896236859586044, 9.508790946821524, 0.05178280292805854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 164.17647058823533, 78, 473, 82.0, 469.8, 473.0, 473.0, 0.0896232134666786, 3.121573230073333, 0.05187005260091838], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.44052863436123346], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.14684287812041116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.14684287812041116], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.2481644640234948], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1362, 27, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.57531227038942, "KoPercent": 2.4246877296105804};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7945638432364096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf9917ef-b394-4ab1-b3a7-47c71fb5032d"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5196332b-1df6-4bdc-ae21-4124629fe33d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f70c7806-9543-4a50-bb78-52eeb1e973c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bf531d3-c467-4335-bcf6-76f3d89daf3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24ba26e0-ddaa-4942-bb3d-8611cb6e2229"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed28e116-e111-4294-85dd-3762dfaa4cf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46e21c44-0f4b-4507-b788-93c5246ca465"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb0b5b16-6f1b-4e85-883b-52856fa672ce"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0a8cade-6603-4012-b170-b942e4c2e7a9"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f70c7806-9543-4a50-bb78-52eeb1e973c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5196332b-1df6-4bdc-ae21-4124629fe33d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59f2a368-e263-4b29-a8ff-a28ca52e733a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c97fc868-1156-4ec6-ab64-af6fbbfd0ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d2fc51c-8494-4d3b-93b7-9da9c1cd2b49"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53ebcd03-3926-4d6f-b3b1-6a0516b411b4"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a299f88d-8ea6-4e5b-adb2-26faae95b30c"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46e21c44-0f4b-4507-b788-93c5246ca465"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/98308223-e3de-4e94-8c94-b29bb484452a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24ba26e0-ddaa-4942-bb3d-8611cb6e2229"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf9917ef-b394-4ab1-b3a7-47c71fb5032d"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1de51e49-919e-46e5-9c96-b9d8224081a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bf531d3-c467-4335-bcf6-76f3d89daf3a"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7950819672131147, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8885714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a299f88d-8ea6-4e5b-adb2-26faae95b30c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1de51e49-919e-46e5-9c96-b9d8224081a9"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0a8cade-6603-4012-b170-b942e4c2e7a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd6f0665-213d-42b0-a625-574c39d1f6f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d2fc51c-8494-4d3b-93b7-9da9c1cd2b49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59f2a368-e263-4b29-a8ff-a28ca52e733a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53ebcd03-3926-4d6f-b3b1-6a0516b411b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 33, 2.4246877296105804, 316.04996326230753, 81, 3036, 97.0, 877.5999999999997, 1060.8999999999999, 1691.1199999999972, 5.249576678148107, 760.1792399504453, 3.8393450781843637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bf9917ef-b394-4ab1-b3a7-47c71fb5032d", 3, 0, 0.0, 351.3333333333333, 214, 421, 419.0, 421.0, 421.0, 421.0, 0.042687004652883505, 0.027443630921043273, 0.02737415337440772], "isController": false}, {"data": ["see books", 61, 0, 0.0, 1366.5901639344258, 992, 1800, 1389.0, 1671.0, 1731.3, 1800.0, 0.265686385532723, 319.7096823291876, 1.306377881989512], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 607.2857142857142, 84, 1476, 520.5, 1231.0, 1476.0, 1476.0, 0.08692736597662895, 0.017123526891601574, 0.05848921402138413], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 607.2857142857142, 84, 1476, 520.5, 1231.0, 1476.0, 1476.0, 0.08668193919881122, 0.017075181103337257, 0.05832407823045013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 128.46666666666667, 81, 259, 85.0, 254.2, 259.0, 259.0, 0.09124975666731555, 0.042690153086675106, 0.0510190696783142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5196332b-1df6-4bdc-ae21-4124629fe33d", 3, 0, 0.0, 753.6666666666666, 221, 1123, 917.0, 1123.0, 1123.0, 1123.0, 0.0677445578538524, 0.031446529785023936, 0.04344296190497697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 96.73333333333332, 82, 253, 84.0, 158.80000000000007, 253.0, 253.0, 0.09124920156948627, 0.0678131273382608, 0.04580282188155854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 192.13333333333333, 81, 650, 86.0, 552.8000000000001, 650.0, 650.0, 0.0912508668832354, 3.598753589200764, 0.05268905848876398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 252.99999999999997, 82, 958, 88.0, 929.8000000000001, 958.0, 958.0, 0.0912508668832354, 10.96900768864596, 0.05259994631407332], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 248.66666666666666, 82, 853, 214.0, 580.6000000000001, 853.0, 853.0, 0.08511217785040684, 0.13287695474301797, 0.0550070696302727], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f70c7806-9543-4a50-bb78-52eeb1e973c0", 3, 0, 0.0, 385.6666666666667, 308, 450, 399.0, 450.0, 450.0, 450.0, 0.052518250091906936, 0.03376417445687376, 0.03367869553419814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 94.66666666666666, 82, 248, 85.0, 113.9000000000002, 248.0, 248.0, 0.13391362571141613, 0.09951979410780047, 0.06721836290592569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 111.5, 81, 252, 83.5, 248.4, 252.0, 252.0, 0.13391860724648463, 0.03583368982962577, 0.07637545569526077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 546.5, 416, 668, 532.0, 668.0, 668.0, 668.0, 0.03160006952015294, 9.291469659983253, 0.018021914648212227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 868.5, 584, 1048, 891.5, 1048.0, 1048.0, 1048.0, 0.03151906115223181, 28.36090662937787, 0.01794493423022573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 165.83333333333334, 83, 248, 166.0, 248.0, 248.0, 248.0, 0.031639228424682815, 0.05598660342336451, 0.01751898683280777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bf531d3-c467-4335-bcf6-76f3d89daf3a", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24ba26e0-ddaa-4942-bb3d-8611cb6e2229", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 84.85714285714286, 81, 96, 84.0, 91.5, 96.0, 96.0, 0.08009794834826589, 0.05952591669241244, 0.04020541547950065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 130.71428571428572, 81, 258, 84.0, 252.0, 258.0, 258.0, 0.08002423591144747, 0.038583113743019315, 0.0446787098378366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 242.99999999999997, 82, 975, 83.0, 953.0, 975.0, 975.0, 0.08009886488465763, 10.314662043579505, 0.046106015138685466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 188.21428571428572, 82, 489, 86.0, 488.0, 489.0, 489.0, 0.08002377849418112, 3.3798659101561603, 0.0461409425943709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 83.83333333333333, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.031666446760786386, 0.023533365219685975, 0.01778145203852751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed28e116-e111-4294-85dd-3762dfaa4cf6", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 94.16666666666667, 82, 246, 85.0, 107.40000000000022, 246.0, 246.0, 0.13391462198878093, 0.036094175457913616, 0.07872715081762317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 629.3571428571429, 82, 1103, 769.0, 1056.0, 1103.0, 1103.0, 0.06995557820783802, 40.47211758814402, 0.037261495200547654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 122.61111111111111, 83, 258, 85.0, 257.1, 258.0, 258.0, 0.13391462198878093, 0.036094175457913616, 0.07885792681565909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 478.3571428571428, 82, 771, 647.0, 768.0, 771.0, 771.0, 0.06992552931128349, 13.224148703505767, 0.03731377645307747], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 395.3571428571429, 86, 704, 445.0, 622.0, 704.0, 704.0, 0.08666530478330578, 0.017071904346265036, 0.058869052593459245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/46e21c44-0f4b-4507-b788-93c5246ca465", 3, 0, 0.0, 606.0, 216, 1310, 292.0, 1310.0, 1310.0, 1310.0, 0.022178522318986295, 0.026214262545650794, 0.014222555002735351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb0b5b16-6f1b-4e85-883b-52856fa672ce", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 353.42857142857144, 168, 1061, 255.0, 1038.0, 1061.0, 1061.0, 0.07998537410302116, 13.77629786981809, 0.1769654084681658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0a8cade-6603-4012-b170-b942e4c2e7a9", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 592.5652173913045, 95, 1143, 640.0, 1012.6, 1116.9999999999995, 1143.0, 0.09821001571360251, 0.06032626941782811, 0.04440550515175582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 98.4285714285714, 82, 246, 84.5, 179.0, 246.0, 246.0, 0.07001015147196343, 0.0520290285841447, 0.03514181431307539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 133.5, 83, 262, 86.0, 256.0, 262.0, 262.0, 0.07000910118315382, 0.08632958222068869, 0.03614727727104524], "isController": false}, {"data": ["login", 23, 0, 0.0, 2740.6521739130435, 1585, 4436, 2630.0, 3688.2000000000003, 4311.799999999998, 4436.0, 0.09817899311039588, 30.775045781291354, 0.19060114223788344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f70c7806-9543-4a50-bb78-52eeb1e973c0", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 113.22222222222223, 84, 324, 89.5, 264.6000000000001, 324.0, 324.0, 0.13416215732748982, 0.10861369963329011, 0.04769045436250615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 737.7857142857142, 167, 1188, 885.5, 1141.0, 1188.0, 1188.0, 0.0698948083134882, 53.793430535481605, 0.1456986922182116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5196332b-1df6-4bdc-ae21-4124629fe33d", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5923411885245902, 2.260502049180328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59f2a368-e263-4b29-a8ff-a28ca52e733a", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c97fc868-1156-4ec6-ab64-af6fbbfd0ede", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d2fc51c-8494-4d3b-93b7-9da9c1cd2b49", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53ebcd03-3926-4d6f-b3b1-6a0516b411b4", 3, 0, 0.0, 352.0, 176, 527, 353.0, 527.0, 527.0, 527.0, 0.04142216085605799, 0.025767496548153263, 0.026563039351052815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 558.3636363636365, 82, 1134, 668.0, 1118.2, 1134.0, 1134.0, 0.05148173802347567, 33.60083787991182, 0.0787445724792669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 384.1333333333334, 169, 1043, 336.0, 1016.6, 1043.0, 1043.0, 0.09120204292576153, 14.670412679744027, 0.20200421239435765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a299f88d-8ea6-4e5b-adb2-26faae95b30c", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1153.0434782608695, 127, 2872, 1100.0, 2080.6, 2716.199999999998, 2872.0, 0.10440593025683859, 0.032892832986826694, 0.04710501931509709], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 237.2777777777778, 166, 495, 174.5, 362.7000000000002, 495.0, 495.0, 0.1338270062898693, 0.2074057216621314, 0.3009800737163759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 102.82352941176471, 85, 250, 90.0, 148.39999999999992, 250.0, 250.0, 0.08530410914911661, 0.06622731130229267, 0.03032294504910004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46e21c44-0f4b-4507-b788-93c5246ca465", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 340.5263157894737, 169, 1056, 187.0, 980.0, 1056.0, 1056.0, 0.10827568128198406, 13.785443144938396, 0.24059840300493507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 101.8, 82, 257, 84.0, 240.30000000000007, 257.0, 257.0, 0.04557573547843128, 0.03387024872957638, 0.022876882847571955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 116.6, 82, 246, 85.5, 245.8, 246.0, 246.0, 0.045542317921812944, 0.012186128037672606, 0.025973353189783947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 83.59999999999998, 81, 87, 83.0, 87.0, 87.0, 87.0, 0.0455763586312508, 0.012284252912329317, 0.026793913960950176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 116.3, 82, 245, 84.5, 244.8, 245.0, 245.0, 0.0455761509117509, 0.01228419692543286, 0.02683829980447831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.5, 86, 87, 86.5, 87.0, 87.0, 87.0, 0.08169267216730658, 0.024092956049342376, 0.050499474103422926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98308223-e3de-4e94-8c94-b29bb484452a", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.5968896028037383, 1.1152891355140186], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 923.3442622950821, 650, 1458, 837.0, 1311.6000000000001, 1351.3999999999999, 1458.0, 0.25728843298690784, 307.80641378412236, 0.5080441518550074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24ba26e0-ddaa-4942-bb3d-8611cb6e2229", 3, 0, 0.0, 361.0, 213, 581, 289.0, 581.0, 581.0, 581.0, 0.034783415267600405, 0.028997502115991093, 0.02230577085845469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1153.0434782608695, 127, 2872, 1100.0, 2080.6, 2716.199999999998, 2872.0, 0.09849263446385749, 0.03102986360911271, 0.0444371065647482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 99.45454545454547, 81, 257, 83.0, 223.0000000000001, 257.0, 257.0, 0.054174649219146304, 0.014601760922348028, 0.031901673319477755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 100.18181818181817, 83, 247, 84.0, 216.80000000000013, 247.0, 247.0, 0.054174382412040506, 0.014601689009495291, 0.0318486115352035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 113.88235294117646, 82, 248, 84.0, 247.2, 248.0, 248.0, 0.08328801485466242, 0.02244872275379573, 0.04896424310791677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 114.4705882352941, 81, 253, 85.0, 252.2, 253.0, 253.0, 0.08328883096776722, 0.02244894272178101, 0.04904605964215199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 100.72727272727273, 82, 246, 85.0, 216.0000000000001, 246.0, 246.0, 0.054174649219146304, 0.014495951060591882, 0.030896479632794377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 95.17647058823532, 82, 257, 84.0, 125.79999999999988, 257.0, 257.0, 0.08328719875755096, 0.06189605298290653, 0.041806269688848825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 86.0, 83, 92, 86.0, 91.2, 92.0, 92.0, 0.05417384880571288, 0.04026005755971435, 0.027192732701305095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 84.52941176470588, 81, 87, 85.0, 87.0, 87.0, 87.0, 0.08328719875755096, 0.022285832480047816, 0.047499730541415784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 134.45454545454544, 85, 271, 89.0, 267.0, 271.0, 271.0, 0.05177713239412753, 0.04075426631803397, 0.01840515253072502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf9917ef-b394-4ab1-b3a7-47c71fb5032d", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 643.9285714285714, 83, 1341, 541.5, 1325.5, 1341.0, 1341.0, 0.08904946061469571, 0.017193701658864236, 0.060600344430592305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1608.130434782609, 896, 3036, 1474.0, 2373.2000000000003, 2928.7999999999984, 3036.0, 0.09879894843554013, 0.051136174483238546, 0.0454436569464252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 203.1818181818182, 168, 344, 174.0, 341.2, 344.0, 344.0, 0.05415118024958771, 0.08392375298446846, 0.12178727354960987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1de51e49-919e-46e5-9c96-b9d8224081a9", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf531d3-c467-4335-bcf6-76f3d89daf3a", 3, 0, 0.0, 624.0, 189, 1341, 342.0, 1341.0, 1341.0, 1341.0, 0.03085245328424365, 0.031143703657044133, 0.01978493911782552], "isController": false}, {"data": ["addBook", 57, 18, 31.57894736842105, 917.1578947368422, 428, 3242, 739.0, 1519.6000000000001, 1587.9999999999986, 3242.0, 0.2783284666542965, 88.72973516222399, 1.0095081444646816], "isController": true}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 144.13114754098362, 82, 411, 87.0, 336.0, 342.6, 411.0, 0.25835196855729486, 0.1919978985079115, 0.12488693792564545], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 521.1147540983605, 403, 762, 493.0, 667.0, 722.4999999999999, 762.0, 0.25824040912054325, 75.93125467002379, 0.12987676825886696], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 129.55737704918033, 82, 349, 88.0, 258.40000000000003, 323.2999999999999, 349.0, 0.25852387107711217, 0.4574660687419211, 0.1257274294886737], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 776.163934426229, 562, 1134, 746.0, 981.0, 1043.1, 1134.0, 0.25773086982056015, 231.90668970708464, 0.12936881551539836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 91.10526315789473, 85, 132, 86.0, 109.0, 132.0, 132.0, 0.11031503652008315, 0.08241308880650743, 0.0392135481379983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 18, 10.285714285714286, 152.81714285714293, 83, 2891, 91.0, 288.4, 379.1999999999998, 1153.6400000000208, 0.6991945279038547, 1.596855734693633, 0.33055669868311705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 88.0, 83, 104, 86.0, 102.7, 104.0, 104.0, 0.04770059291836998, 0.03694000994557362, 0.01695607013895183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a299f88d-8ea6-4e5b-adb2-26faae95b30c", 3, 0, 0.0, 361.3333333333333, 166, 460, 458.0, 460.0, 460.0, 460.0, 0.031901657822818195, 0.026595099506587692, 0.020457768851221303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 89.33333333333333, 83, 106, 88.0, 101.2, 106.0, 106.0, 0.08819275408332451, 0.07157048695629167, 0.03134976805305676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 236.3, 168, 504, 173.0, 486.6, 504.0, 504.0, 0.04552469487073263, 0.07055438550766864, 0.10238610574931371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1de51e49-919e-46e5-9c96-b9d8224081a9", 3, 0, 0.0, 658.0, 458, 853, 663.0, 853.0, 853.0, 853.0, 0.017434866245517787, 0.024035370621669216, 0.011180562012913425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 221.64705882352942, 169, 506, 174.0, 371.5999999999999, 506.0, 506.0, 0.08325212170480756, 0.12902452846243126, 0.18723597293571467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0a8cade-6603-4012-b170-b942e4c2e7a9", 3, 0, 0.0, 626.3333333333333, 299, 1272, 308.0, 1272.0, 1272.0, 1272.0, 0.032270556344391375, 0.02690263502538617, 0.02069433463491244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd6f0665-213d-42b0-a625-574c39d1f6f9", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.6694673742138365, 1.2509008123689729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d2fc51c-8494-4d3b-93b7-9da9c1cd2b49", 3, 0, 0.0, 375.0, 254, 559, 312.0, 559.0, 559.0, 559.0, 0.06826093881544518, 0.030886297185373956, 0.04377410464401921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 126.92857142857142, 85, 263, 90.5, 261.0, 263.0, 263.0, 0.08312798741204763, 0.06892154425080901, 0.029549401775376304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 102.42857142857143, 85, 246, 90.5, 173.5, 246.0, 246.0, 0.06863788124666004, 0.053288198819428444, 0.024398621849398682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59f2a368-e263-4b29-a8ff-a28ca52e733a", 3, 0, 0.0, 310.6666666666667, 177, 556, 199.0, 556.0, 556.0, 556.0, 0.05036091992613732, 0.03237721902803425, 0.0322952513849253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53ebcd03-3926-4d6f-b3b1-6a0516b411b4", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.52631578947368, 82, 258, 86.0, 248.0, 258.0, 258.0, 0.10842830321118979, 0.08058001830440961, 0.05442592563530426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 110.94736842105264, 81, 259, 84.0, 247.0, 259.0, 259.0, 0.10832815448735127, 0.04611296132114737, 0.06082322983243345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 208.1578947368421, 81, 970, 85.0, 892.0, 970.0, 970.0, 0.10842768444119795, 10.29598216578593, 0.06276277663326334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 182.73684210526312, 83, 536, 88.0, 499.0, 536.0, 536.0, 0.10832938976344282, 3.3790128199280467, 0.06281166971224293], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 18.181818181818183, 0.440852314474651], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.2204261572373255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.14695077149155034], "isController": false}, {"data": ["401/Unauthorized", 22, 66.66666666666667, 1.6164584864070537], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 33, "401/Unauthorized", 22, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

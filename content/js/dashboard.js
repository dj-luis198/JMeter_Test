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

    var data = {"OkPercent": 98.75195007800312, "KoPercent": 1.24804992199688};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7494983277591973, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8229cc69-91e3-4b02-b876-a44ba2f09e09"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cec50ceb-5985-4086-9c5f-bd2ea6ec47e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b3ff561-4119-4478-8c23-442fc16e6807"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3eddfcce-e1cb-42c9-98a6-68e7703a726d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce61f5b9-6a4f-45ac-aa75-9f116b0a3059"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/617fcdf0-76af-4a8c-ad23-f4d9b9485949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58e5ae2e-0d16-4be8-90c7-d9d95aa25034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2601ac9-80f5-458c-9b73-d277a9e6ae14"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ab6e38f-2e63-4007-97fb-7aee91661930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aae93746-0ca5-4396-8c40-23f1466b0665"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebda4552-b52d-47c2-9baf-fe4af237a0e1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2cfa1209-d19d-44ad-aa1a-e73daeb31112"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcc915e2-0c00-4e00-b6ec-92ad15e875eb"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95f7df35-3969-4322-83d3-31121d678872"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3eddfcce-e1cb-42c9-98a6-68e7703a726d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b3ff561-4119-4478-8c23-442fc16e6807"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8229cc69-91e3-4b02-b876-a44ba2f09e09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e66aea7-b6d3-498e-9b9c-efc67c8b7a40"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f683d04-1bfc-4ca4-8ce4-320958be9c43"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58e5ae2e-0d16-4be8-90c7-d9d95aa25034"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2601ac9-80f5-458c-9b73-d277a9e6ae14"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec50ceb-5985-4086-9c5f-bd2ea6ec47e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=617fcdf0-76af-4a8c-ad23-f4d9b9485949"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4649122807017544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9606060606060606, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ab6e38f-2e63-4007-97fb-7aee91661930"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bf6c14a-e1de-4ad3-942c-7272e002b5fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcc915e2-0c00-4e00-b6ec-92ad15e875eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cfa1209-d19d-44ad-aa1a-e73daeb31112"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebda4552-b52d-47c2-9baf-fe4af237a0e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95f7df35-3969-4322-83d3-31121d678872"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f683d04-1bfc-4ca4-8ce4-320958be9c43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 16, 1.24804992199688, 453.5124804992202, 125, 4027, 152.0, 1226.3000000000009, 1476.2499999999995, 1971.9100000000017, 5.012864527531653, 733.0015569585266, 3.6574793884070664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8229cc69-91e3-4b02-b876-a44ba2f09e09", 3, 0, 0.0, 339.6666666666667, 239, 451, 329.0, 451.0, 451.0, 451.0, 0.01964623676334798, 0.027083923402597233, 0.012598660945245938], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2082.7017543859656, 1545, 2929, 2023.0, 2509.8, 2648.6, 2929.0, 0.2466571465662729, 296.8107410127007, 1.2128112626574061], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cec50ceb-5985-4086-9c5f-bd2ea6ec47e7", 3, 0, 0.0, 437.66666666666663, 229, 821, 263.0, 821.0, 821.0, 821.0, 0.07554391619661564, 0.035017752820306204, 0.04844450355056406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b3ff561-4119-4478-8c23-442fc16e6807", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 522.0714285714287, 169, 827, 498.0, 760.5, 827.0, 827.0, 0.07447838530860651, 0.014063406042856991, 0.05036746272090822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 522.0714285714287, 169, 827, 498.0, 760.5, 827.0, 827.0, 0.07467025083870693, 0.014099635115818892, 0.05049721553301225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3eddfcce-e1cb-42c9-98a6-68e7703a726d", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 210.8235294117647, 130, 400, 133.0, 397.6, 400.0, 400.0, 0.09510383100608664, 0.050655027636054416, 0.0528293914193967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 151.00000000000003, 131, 395, 134.0, 205.39999999999984, 395.0, 395.0, 0.09510063885252688, 0.07067537711598922, 0.04773606286152228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 286.6470588235294, 130, 1059, 132.0, 1045.4, 1059.0, 1059.0, 0.09510383100608664, 4.955877678991004, 0.054561233930249725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 402.3529411764706, 131, 1344, 134.0, 1264.0, 1344.0, 1344.0, 0.09510329896561176, 15.122424300221535, 0.05446805438230408], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 257.4285714285715, 133, 418, 238.0, 398.0, 418.0, 418.0, 0.07384511514563312, 0.13937132257919888, 0.047734562085280555], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 133.6, 132, 137, 134.0, 136.4, 137.0, 137.0, 0.11459391735486679, 0.08516208115923207, 0.05752077492226713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 972.4, 770, 1200, 1036.0, 1200.0, 1200.0, 1200.0, 0.02740717190874508, 8.058618544925837, 0.01563065272920618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 184.0666666666667, 126, 400, 132.0, 398.8, 400.0, 400.0, 0.11436326347008638, 0.04205232500514634, 0.06458248355075061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1334.2, 1165, 1456, 1429.0, 1456.0, 1456.0, 1456.0, 0.027304499781564, 24.56863689964231, 0.015545432981105285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 291.6, 128, 410, 392.0, 410.0, 410.0, 410.0, 0.027461211039406835, 0.04859347109707538, 0.01520557290951531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce61f5b9-6a4f-45ac-aa75-9f116b0a3059", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 133.0, 128, 140, 133.0, 138.8, 140.0, 140.0, 0.05257950259790543, 0.0390751967548887, 0.026392445639964245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/617fcdf0-76af-4a8c-ad23-f4d9b9485949", 3, 0, 0.0, 424.6666666666667, 378, 507, 389.0, 507.0, 507.0, 507.0, 0.019951053415620347, 0.02358146971097574, 0.012794132561449244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 179.9090909090909, 130, 398, 134.0, 396.6, 398.0, 398.0, 0.052579251271461895, 0.01406905746912164, 0.029986604240755613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 155.9090909090909, 126, 394, 133.0, 342.00000000000017, 394.0, 394.0, 0.05258025659165217, 0.014172022284468748, 0.03091143991032676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 155.36363636363635, 129, 389, 132.0, 338.6000000000002, 389.0, 389.0, 0.05258025659165217, 0.014172022284468748, 0.030962787817154547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58e5ae2e-0d16-4be8-90c7-d9d95aa25034", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 185.6, 130, 397, 132.0, 397.0, 397.0, 397.0, 0.027503506697103882, 0.02043961777001568, 0.015443863623862044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2601ac9-80f5-458c-9b73-d277a9e6ae14", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 750.8500000000001, 129, 1708, 267.0, 1578.9, 1701.55, 1708.0, 0.09577810129491993, 38.79578511255124, 0.052603129070569306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 254.8666666666667, 130, 1437, 133.0, 813.6000000000004, 1437.0, 1437.0, 0.1145947928126146, 6.903000819830248, 0.0667126717011979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 523.7, 128, 1197, 275.0, 1152.7000000000003, 1195.25, 1197.0, 0.09578131210819456, 12.687497530638048, 0.05269842894702815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 185.53333333333333, 130, 648, 133.0, 504.0000000000001, 648.0, 648.0, 0.11435367303997805, 2.2703522140776995, 0.06668397457155491], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 552.9285714285714, 139, 1726, 470.0, 1307.0, 1726.0, 1726.0, 0.07471089551681262, 0.01410730986077091, 0.05112922683562002], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5ab6e38f-2e63-4007-97fb-7aee91661930", 3, 0, 0.0, 537.3333333333333, 250, 1112, 250.0, 1112.0, 1112.0, 1112.0, 0.04459839148468045, 0.028962822595031742, 0.028599879955996256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aae93746-0ca5-4396-8c40-23f1466b0665", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 338.1818181818182, 264, 529, 268.0, 528.4, 529.0, 529.0, 0.052545595246056696, 0.08143540981981637, 0.11817627524577007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 716.4545454545455, 223, 1658, 572.0, 1302.7, 1606.0999999999992, 1658.0, 0.09057299771920725, 0.055635171450567726, 0.040952439398430615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 147.70000000000002, 128, 400, 134.0, 148.3, 387.4499999999998, 400.0, 0.09577443205761789, 0.07117611601156955, 0.048074275466421484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 206.85000000000002, 129, 527, 133.5, 412.8, 521.3499999999999, 527.0, 0.09577855996935086, 0.09036295584608385, 0.05100395385867874], "isController": false}, {"data": ["login", 22, 0, 0.0, 3015.3636363636365, 2020, 6983, 2813.0, 3893.2, 6530.599999999993, 6983.0, 0.09431939978563773, 25.77520850080386, 0.17785369774919615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 159.4, 133, 410, 137.0, 271.4000000000001, 410.0, 410.0, 0.11667976072870401, 0.09446047035556213, 0.0414760086965315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebda4552-b52d-47c2-9baf-fe4af237a0e1", 3, 0, 0.0, 432.33333333333337, 224, 844, 229.0, 844.0, 844.0, 844.0, 0.052505381801634665, 0.03375590138614208, 0.033670443407949315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cfa1209-d19d-44ad-aa1a-e73daeb31112", 3, 0, 0.0, 571.6666666666666, 235, 965, 515.0, 965.0, 965.0, 965.0, 0.06234284408054696, 0.028208513434882898, 0.03997897227821533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcc915e2-0c00-4e00-b6ec-92ad15e875eb", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 908.1999999999998, 263, 1844, 544.0, 1713.4, 1837.5, 1844.0, 0.09571255605166565, 51.609056120159934, 0.20423975217626425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95f7df35-3969-4322-83d3-31121d678872", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1124.0, 133, 1593, 1560.0, 1593.0, 1593.0, 1593.0, 0.03819897299332609, 32.64524306825065, 0.06875601974886904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 585.235294117647, 264, 1502, 530.0, 1402.0, 1502.0, 1502.0, 0.09502993442934525, 20.184023983179703, 0.20943379103755919], "isController": false}, {"data": ["register", 24, 6, 25.0, 1267.5000000000002, 367, 2658, 1193.0, 2448.5, 2648.5, 2658.0, 0.0975712880223113, 0.030776880889850148, 0.044021420963191234], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 425.8, 264, 1569, 269.0, 952.2000000000004, 1569.0, 1569.0, 0.1142369731771587, 9.276384337920582, 0.25497305673388876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 136.71428571428572, 130, 149, 136.0, 145.5, 149.0, 149.0, 0.09028239041974863, 0.07009228553095719, 0.03209256846952002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eddfcce-e1cb-42c9-98a6-68e7703a726d", 3, 0, 0.0, 805.0, 310, 1610, 495.0, 1610.0, 1610.0, 1610.0, 0.025212202706109757, 0.025286066581225314, 0.016167981553071687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b3ff561-4119-4478-8c23-442fc16e6807", 3, 0, 0.0, 386.0, 257, 584, 317.0, 584.0, 584.0, 584.0, 0.06224841266547703, 0.02816578567871519, 0.039918415674150304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 457.78947368421046, 266, 1449, 281.0, 811.0, 1449.0, 1449.0, 0.10653628121092501, 6.864548317708013, 0.2381679456861217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 163.55555555555554, 132, 394, 134.0, 394.0, 394.0, 394.0, 0.0450063008821235, 0.03344706540165623, 0.022591053372472147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 163.11111111111114, 131, 401, 134.0, 401.0, 401.0, 401.0, 0.044946289184424615, 0.012026643785676116, 0.02563343055049216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 133.00000000000003, 131, 140, 132.0, 140.0, 140.0, 140.0, 0.0450067510126519, 0.012130725858878831, 0.026459046982047308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 165.55555555555554, 131, 395, 135.0, 395.0, 395.0, 395.0, 0.044947636004055276, 0.012114792516718023, 0.026468187998481767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 2.121740107913669, 4.447223471223021], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1429.3508771929833, 1016, 2381, 1305.0, 1967.0, 2107.1, 2381.0, 0.2641065322348973, 315.96323083953445, 0.5215072345497679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1267.5000000000002, 367, 2658, 1193.0, 2448.5, 2648.5, 2658.0, 0.09438859785737883, 0.029772965925716172, 0.04258548067393459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 132.83333333333331, 130, 136, 132.0, 136.0, 136.0, 136.0, 0.03571045959361497, 0.009625084812341535, 0.02102871790522444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8229cc69-91e3-4b02-b876-a44ba2f09e09", 1, 0, 0.0, 1726.0, 1726, 1726, 1726.0, 1726.0, 1726.0, 1726.0, 0.5793742757821553, 0.10467211037079954, 0.3994514049826188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 131.66666666666669, 125, 134, 133.0, 134.0, 134.0, 134.0, 0.03571109722346219, 0.009625256673511294, 0.020994219266136954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e66aea7-b6d3-498e-9b9c-efc67c8b7a40", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 351.92857142857144, 131, 1369, 134.5, 1273.0, 1369.0, 1369.0, 0.09141603437242893, 11.772020755520877, 0.052620334517388644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 316.92857142857144, 127, 1058, 134.0, 1031.5, 1058.0, 1058.0, 0.09142021300909631, 3.8612030981657184, 0.052712017350250426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 186.66666666666669, 130, 456, 133.5, 456.0, 456.0, 456.0, 0.035710672134367356, 0.009555394692203765, 0.020366242701631385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 170.2857142857143, 130, 396, 134.0, 388.5, 396.0, 396.0, 0.09126050310611641, 0.06782152623413533, 0.045808494723187335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 133.33333333333334, 127, 137, 134.5, 137.0, 137.0, 137.0, 0.035710247055392545, 0.026538572274564184, 0.017924870103976337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 188.07142857142858, 126, 400, 133.0, 397.5, 400.0, 400.0, 0.0914166312971367, 0.04407587580397662, 0.05103925201606321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 136.83333333333334, 133, 142, 136.5, 142.0, 142.0, 142.0, 0.033115324116234794, 0.02606538206805199, 0.011771462869442835], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 670.6428571428571, 133, 1610, 532.5, 1361.0, 1610.0, 1610.0, 0.07498460137650304, 0.014012538161806056, 0.051034092887174955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f683d04-1bfc-4ca4-8ce4-320958be9c43", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1673.0, 985, 4027, 1459.5, 2375.2999999999997, 3785.4999999999964, 4027.0, 0.09278354863334051, 0.04802273513249069, 0.04267680801396814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 321.83333333333337, 260, 588, 271.0, 588.0, 588.0, 588.0, 0.035681153214871905, 0.05529881850781417, 0.08024774985727538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58e5ae2e-0d16-4be8-90c7-d9d95aa25034", 3, 0, 0.0, 478.0, 241, 912, 281.0, 912.0, 912.0, 912.0, 0.01846813016338139, 0.025459808346979227, 0.011843169408157989], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1357.333333333333, 683, 3274, 1084.5, 2280.5, 2415.0, 3274.0, 0.2593385905427861, 92.9439614404938, 0.9402853009648355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a2601ac9-80f5-458c-9b73-d277a9e6ae14", 3, 0, 0.0, 412.3333333333333, 378, 441, 418.0, 441.0, 441.0, 441.0, 0.02383657643198233, 0.023906410151997903, 0.015285825381186585], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 251.00000000000006, 127, 544, 135.0, 533.8, 539.2, 544.0, 0.26588177123905565, 0.1975937772587123, 0.12852683277669197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec50ceb-5985-4086-9c5f-bd2ea6ec47e7", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 855.6491228070175, 625, 1309, 784.0, 1054.4, 1193.1, 1309.0, 0.26523224107284116, 77.98708541466966, 0.13339316811768867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=617fcdf0-76af-4a8c-ad23-f4d9b9485949", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 205.859649122807, 127, 536, 134.0, 401.2, 405.0, 536.0, 0.2664086709011624, 0.4714184684305725, 0.12956202940310438], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1174.3333333333333, 885, 1842, 1161.0, 1459.4, 1576.6999999999998, 1842.0, 0.2647862199676682, 238.25510617143513, 0.13291027056970844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 167.26315789473685, 132, 401, 137.0, 381.0, 401.0, 401.0, 0.10701331470926172, 0.079946470461509, 0.03803988921305788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, 3.6363636363636362, 203.30909090909088, 128, 1239, 140.0, 382.4, 424.4, 741.3600000000026, 0.7253257371947038, 1.6485491493357773, 0.34507492147799407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 197.55555555555554, 131, 409, 139.0, 409.0, 409.0, 409.0, 0.043272351371493135, 0.033510717419525445, 0.01538196865158545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 140.94117647058823, 132, 202, 136.0, 156.39999999999995, 202.0, 202.0, 0.09681313925146359, 0.07856613156051391, 0.034414045593293696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ab6e38f-2e63-4007-97fb-7aee91661930", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 331.55555555555554, 266, 795, 270.0, 795.0, 795.0, 795.0, 0.04491623122875837, 0.06961138570316361, 0.101017656757647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 579.7142857142858, 265, 1501, 525.5, 1406.0, 1501.0, 1501.0, 0.09118026338070365, 15.704451998475987, 0.2017337886376366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf6c14a-e1de-4ad3-942c-7272e002b5fb", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcc915e2-0c00-4e00-b6ec-92ad15e875eb", 3, 0, 0.0, 309.6666666666667, 237, 447, 245.0, 447.0, 447.0, 447.0, 0.02704481325556447, 0.022546148029785353, 0.01734319079214258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cfa1209-d19d-44ad-aa1a-e73daeb31112", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebda4552-b52d-47c2-9baf-fe4af237a0e1", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95f7df35-3969-4322-83d3-31121d678872", 3, 0, 0.0, 313.0, 231, 462, 246.0, 462.0, 462.0, 462.0, 0.10535187526337969, 0.04664015311139205, 0.06755963355106054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f683d04-1bfc-4ca4-8ce4-320958be9c43", 3, 0, 0.0, 371.6666666666667, 222, 550, 343.0, 550.0, 550.0, 550.0, 0.029025329437489117, 0.029110364582325507, 0.018613248369743995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 160.54545454545453, 134, 394, 137.0, 344.4000000000002, 394.0, 394.0, 0.05093889647826993, 0.042233518662159346, 0.018107185857510016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 139.9, 135, 158, 137.5, 148.9, 157.54999999999998, 158.0, 0.09450813242479515, 0.07337301296651576, 0.0335946876978764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 149.8421052631579, 131, 410, 135.0, 145.0, 410.0, 410.0, 0.10662296995476941, 0.07923835950740188, 0.05351973296557761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 215.52631578947367, 128, 399, 133.0, 397.0, 399.0, 399.0, 0.10661698689172203, 0.03695646379511582, 0.06033372870465972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 264.36842105263156, 130, 1304, 135.0, 403.0, 1304.0, 1304.0, 0.10661638862234792, 5.076361577207099, 0.062196546611001685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 250.52631578947367, 130, 1056, 135.0, 396.0, 1056.0, 1056.0, 0.10661698689172203, 1.677168059935581, 0.06230101377323128], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.46801872074882994], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.078003120124805], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.62402496099844], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

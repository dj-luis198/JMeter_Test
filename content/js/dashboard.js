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

    var data = {"OkPercent": 68.5805422647528, "KoPercent": 31.41945773524721};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5292056074766355, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45028813-788b-4bbb-a3db-d72b45fe048b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16910a3d-273b-4d2b-a351-84b5a8af95f5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad1264be-eb53-4434-9610-9fdfc775db1d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb50f589-e197-4bf0-a080-dfb097f72afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad1264be-eb53-4434-9610-9fdfc775db1d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.71875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45028813-788b-4bbb-a3db-d72b45fe048b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ae4b9ae-0d49-4298-bc31-0b1e77842ecb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ae4b9ae-0d49-4298-bc31-0b1e77842ecb"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3070b040-ed41-4d57-842f-a0ba5b42b390"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9664804469273743, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d207f3c1-e24f-47a4-b22d-d472fafffc0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3070b040-ed41-4d57-842f-a0ba5b42b390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d207f3c1-e24f-47a4-b22d-d472fafffc0b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2dacb83-8d7d-4354-a692-d570a2cc2280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2a1aa4b-e0df-4fa9-989a-edaa8d12d4f9"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93388098-2128-4f10-be49-ca02f9d265b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cce7ed6-893c-4e15-8d5b-9654a920b47e"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7075f27-3d4f-4a6a-bae6-7c05e8b94b20"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cce7ed6-893c-4e15-8d5b-9654a920b47e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2dacb83-8d7d-4354-a692-d570a2cc2280"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c744961e-af93-40c9-b7fa-93ad9d90bf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d94ce18-3a8b-49d3-bcd1-40f1bbcc9854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/753e1fb8-1156-4405-ac62-ddc91df79140"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93388098-2128-4f10-be49-ca02f9d265b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb50f589-e197-4bf0-a080-dfb097f72afb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/755792c8-6464-4a55-b97e-9aa74a4c789c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c744961e-af93-40c9-b7fa-93ad9d90bf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=753e1fb8-1156-4405-ac62-ddc91df79140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e3eec6d-f7d3-43fd-b420-340a731893d5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2394947a-9da9-4d32-be23-225fb9ce96d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=755792c8-6464-4a55-b97e-9aa74a4c789c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3eec6d-f7d3-43fd-b420-340a731893d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2394947a-9da9-4d32-be23-225fb9ce96d5"], "isController": false}, {"data": [0.4, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 627, 197, 31.41945773524721, 238.22328548644327, 78, 1614, 86.0, 543.2, 970.2000000000003, 1427.5200000000004, 2.449352698975725, 2.506572472469198, 1.1795841618291625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/45028813-788b-4bbb-a3db-d72b45fe048b", 3, 0, 0.0, 400.0, 196, 504, 500.0, 504.0, 504.0, 504.0, 0.028180921516133578, 0.028263482809637877, 0.018071749800385138], "isController": false}, {"data": ["see books", 57, 57, 100.0, 466.6842105263157, 323, 719, 493.0, 593.0, 625.7999999999997, 719.0, 0.2511987025807362, 1.616592417985827, 0.4216900095080912], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 21, 100.0, 120.42857142857143, 80, 244, 83.0, 243.6, 244.0, 244.0, 0.09652509652509653, 0.047979759893822395, 0.04845107384169884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 106.13333333333334, 81, 251, 85.0, 242.0, 251.0, 251.0, 0.07918241516923921, 0.061474628964399584, 0.0281468741421905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16910a3d-273b-4d2b-a351-84b5a8af95f5", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 2.033986863057325, 3.8005075636942673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 101.68749999999999, 78, 246, 81.5, 240.4, 246.0, 246.0, 0.1598561294834649, 0.07945973623738635, 0.08024028374462983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad1264be-eb53-4434-9610-9fdfc775db1d", 3, 0, 0.0, 433.6666666666667, 163, 975, 163.0, 975.0, 975.0, 975.0, 0.035594366598246385, 0.02893200956895222, 0.022825814517755658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb50f589-e197-4bf0-a080-dfb097f72afb", 3, 0, 0.0, 368.66666666666663, 201, 650, 255.0, 650.0, 650.0, 650.0, 0.01953900963273175, 0.02309444790900032, 0.012529898755365088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad1264be-eb53-4434-9610-9fdfc775db1d", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 0.08959369260404067, 0.026423139810957307, 0.05538360099448999], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 147.05263157894734, 78, 465, 83.0, 325.2, 333.89999999999975, 465.0, 0.2507599787073983, 0.12464534097857982, 0.12121698189468962], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 482.81250000000006, 83, 1160, 410.0, 954.9000000000002, 1160.0, 1160.0, 0.09296218182240737, 0.01812263236943171, 0.0626291847507161], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 482.81250000000006, 83, 1160, 410.0, 954.9000000000002, 1160.0, 1160.0, 0.09321347633834162, 0.01817162130277485, 0.06279848338761077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, 16.0, 1000.08, 382, 1590, 946.0, 1458.6000000000004, 1572.8999999999999, 1590.0, 0.0976615908682506, 0.031114372465681717, 0.044062163067511505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45028813-788b-4bbb-a3db-d72b45fe048b", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ae4b9ae-0d49-4298-bc31-0b1e77842ecb", 3, 0, 0.0, 263.0, 166, 406, 217.0, 406.0, 406.0, 406.0, 0.08868130893611989, 0.040125982884507375, 0.05686919876437376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.25, 81, 252, 84.0, 252.0, 252.0, 252.0, 0.04643846033284767, 0.03655214748855002, 0.016507421446441944], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 449.5625, 81, 975, 424.5, 755.2000000000003, 975.0, 975.0, 0.09397061069150624, 0.020693723350522126, 0.06296443873116184], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ae4b9ae-0d49-4298-bc31-0b1e77842ecb", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.1221370341614907, 4.282317546583851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1112.1363636363635, 713, 1614, 1087.0, 1575.6999999999998, 1612.8, 1614.0, 0.0977152400241623, 0.050575270715630886, 0.04494519340955122], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 201.1875, 81, 382, 177.5, 341.40000000000003, 382.0, 382.0, 0.09245668981936275, 0.1900316790568262, 0.05878990445178962], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 81.5, 80, 83, 81.5, 83.0, 83.0, 83.0, 0.04639267923521668, 0.023060423565161418, 0.023286950319239625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3070b040-ed41-4d57-842f-a0ba5b42b390", 3, 0, 0.0, 295.6666666666667, 183, 486, 218.0, 486.0, 486.0, 486.0, 0.03784581614502516, 0.03795669255951254, 0.024269615171126163], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 546.9836065573771, 331, 909, 560.0, 702.6, 857.8999999999999, 909.0, 0.2881408772708808, 0.9049239910345674, 0.563886862488309], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 134.31249999999997, 80, 417, 84.5, 297.3000000000001, 417.0, 417.0, 0.16612847961292065, 0.1241096551795745, 0.05905348298740538], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 408.125, 85, 999, 396.5, 842.9000000000002, 999.0, 999.0, 0.09345739802921711, 0.018219172931232878, 0.06360168383946356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, 3.35195530726257, 148.7988826815642, 79, 476, 87.0, 325.0, 390.0, 474.4, 0.765428297755884, 1.6174859275045328, 0.36917166039143745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 84.54545454545456, 82, 90, 84.0, 89.2, 90.0, 90.0, 0.06029610870840254, 0.04669415449781564, 0.021433382392439967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d207f3c1-e24f-47a4-b22d-d472fafffc0b", 3, 0, 0.0, 292.3333333333333, 164, 382, 331.0, 382.0, 382.0, 382.0, 0.024922739507526666, 0.029457834359319444, 0.01598235573887615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3070b040-ed41-4d57-842f-a0ba5b42b390", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d207f3c1-e24f-47a4-b22d-d472fafffc0b", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.5161830357142857, 1.9698660714285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 105.92307692307692, 79, 243, 82.0, 239.4, 243.0, 243.0, 0.07713943249112896, 0.038343721814438125, 0.03872037919964871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2dacb83-8d7d-4354-a692-d570a2cc2280", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.1808449074074074, 0.6901432682682682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 114.0625, 81, 243, 85.0, 242.3, 243.0, 243.0, 0.09835622164574548, 0.07981837908946728, 0.03496256316313609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a1aa4b-e0df-4fa9-989a-edaa8d12d4f9", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.995849609375, 3.729248046875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 452.54545454545445, 105, 1432, 348.0, 1008.3999999999996, 1388.3499999999995, 1432.0, 0.09847453985533196, 0.06048875543848027, 0.04452510932911982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93388098-2128-4f10-be49-ca02f9d265b1", 3, 0, 0.0, 285.6666666666667, 173, 405, 279.0, 405.0, 405.0, 405.0, 0.041627351945384916, 0.026762376332075264, 0.026694623480601656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cce7ed6-893c-4e15-8d5b-9654a920b47e", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["login", 22, 4, 18.181818181818183, 1805.9090909090908, 1306, 2862, 1824.5, 2272.0, 2775.7499999999986, 2862.0, 0.09759343462348898, 0.1447786126206055, 0.1466240850615504], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, 100.0, 110.72727272727272, 79, 245, 82.0, 244.6, 245.0, 245.0, 0.059950404665231494, 0.029799566381448074, 0.030092292966727524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 108.61904761904762, 81, 244, 85.0, 238.0, 243.39999999999998, 244.0, 0.09691979656073178, 0.07846338998910805, 0.03445195893369763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 92.73333333333333, 79, 235, 83.0, 148.00000000000006, 235.0, 235.0, 0.07694872649857645, 0.03824892752712442, 0.038624653730730756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7075f27-3d4f-4a6a-bae6-7c05e8b94b20", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cce7ed6-893c-4e15-8d5b-9654a920b47e", 3, 0, 0.0, 288.0, 167, 503, 194.0, 503.0, 503.0, 503.0, 0.09104427786713605, 0.04119516479014294, 0.058384514127037115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2dacb83-8d7d-4354-a692-d570a2cc2280", 3, 0, 0.0, 399.3333333333333, 287, 512, 399.0, 512.0, 512.0, 512.0, 0.025261456070327894, 0.029858185869583526, 0.01619956655551626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c744961e-af93-40c9-b7fa-93ad9d90bf11", 3, 0, 0.0, 446.0, 182, 804, 352.0, 804.0, 804.0, 804.0, 0.018412024279322682, 0.02538246185642303, 0.01180719004891461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d94ce18-3a8b-49d3-bcd1-40f1bbcc9854", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 95.76923076923076, 81, 242, 83.0, 180.79999999999995, 242.0, 242.0, 0.07662790080812963, 0.06353231229111529, 0.027238824115389828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 81.38888888888889, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.08588441865791281, 0.042690594821169554, 0.04310995233414765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/753e1fb8-1156-4405-ac62-ddc91df79140", 3, 0, 0.0, 308.6666666666667, 217, 385, 324.0, 385.0, 385.0, 385.0, 0.03882188519074486, 0.032136736341166726, 0.02489554486515865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93388098-2128-4f10-be49-ca02f9d265b1", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 100.33333333333331, 81, 363, 85.0, 116.40000000000039, 363.0, 363.0, 0.08359883704728907, 0.06490339399667462, 0.029716774106653538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb50f589-e197-4bf0-a080-dfb097f72afb", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/755792c8-6464-4a55-b97e-9aa74a4c789c", 3, 0, 0.0, 293.3333333333333, 171, 530, 179.0, 530.0, 530.0, 530.0, 0.02608423468855424, 0.026160653344868362, 0.01672719477098042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 126.8125, 79, 495, 81.5, 319.3000000000002, 495.0, 495.0, 0.09903625345853166, 0.04922798145546154, 0.049711556911802034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, 100.0, 120.5, 78, 241, 81.5, 241.0, 241.0, 241.0, 0.09686402712192758, 0.04814823223150502, 0.055219117023852765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c744961e-af93-40c9-b7fa-93ad9d90bf11", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=753e1fb8-1156-4405-ac62-ddc91df79140", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3eec6d-f7d3-43fd-b420-340a731893d5", 3, 0, 0.0, 280.0, 156, 443, 241.0, 443.0, 443.0, 443.0, 0.016705274411974343, 0.023029569379788846, 0.010712692249866358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2394947a-9da9-4d32-be23-225fb9ce96d5", 3, 0, 0.0, 338.33333333333337, 166, 661, 188.0, 661.0, 661.0, 661.0, 0.07633393552326913, 0.03538395969568204, 0.04895112401720058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=755792c8-6464-4a55-b97e-9aa74a4c789c", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3eec6d-f7d3-43fd-b420-340a731893d5", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2394947a-9da9-4d32-be23-225fb9ce96d5", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["register", 25, 4, 16.0, 1000.08, 382, 1590, 946.0, 1458.6000000000004, 1572.8999999999999, 1590.0, 0.09895190145973845, 0.03152545735568855, 0.044644314916405435], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.030456852791878, 0.6379585326953748], "isController": false}, {"data": ["401/Unauthorized", 10, 5.0761421319796955, 1.594896331738437], "isController": false}, {"data": ["404/Not Found", 183, 92.89340101522842, 29.1866028708134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 627, 197, "404/Not Found", 183, "401/Unauthorized", 10, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

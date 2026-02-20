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

    var data = {"OkPercent": 67.97385620915033, "KoPercent": 32.02614379084967};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5120918984280532, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa27dd5-20cb-49b2-bfcb-204b9e7cb021"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d0b4919-7d7d-4764-a6bd-b13c9ad29104"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50922bb5-eb3f-4de4-a294-23400ba7d51f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03829e24-c35f-4800-9f5e-0381daeee315"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/001c807a-a26d-4775-b012-86f96aaff95e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fad0ebae-da46-4f9a-b64f-59c0369458c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3f482fd-cec8-49f8-a5b9-0eda7e3cbde9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03829e24-c35f-4800-9f5e-0381daeee315"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d0f4960-2acb-4831-a251-e18d0f6932d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3f482fd-cec8-49f8-a5b9-0eda7e3cbde9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac865fd7-0684-4a4e-8d9a-1f2f1ac327f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d0f4960-2acb-4831-a251-e18d0f6932d1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9460227272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c929e4f-c17b-4091-a9f4-d5e10e74681c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b36afc9f-2bc4-4f7e-84ca-c6c0f710ec49"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c929e4f-c17b-4091-a9f4-d5e10e74681c"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c86608c5-d878-422f-bddf-a613a1e3f288"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fad0ebae-da46-4f9a-b64f-59c0369458c4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7363654a-27bb-4337-8c16-d8b775e289c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c86608c5-d878-422f-bddf-a613a1e3f288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3925714e-796e-4d66-ba13-7c43e6e00747"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50922bb5-eb3f-4de4-a294-23400ba7d51f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a40ef44-77f9-4dfe-947c-d752860a763b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b36afc9f-2bc4-4f7e-84ca-c6c0f710ec49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fa27dd5-20cb-49b2-bfcb-204b9e7cb021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/78f327c9-e107-4d92-b778-c9517f62b035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44ef1e0d-221d-4cb0-a2f6-2f6739fab810"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7363654a-27bb-4337-8c16-d8b775e289c5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44ef1e0d-221d-4cb0-a2f6-2f6739fab810"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a40ef44-77f9-4dfe-947c-d752860a763b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e935e6e-0ef2-4732-99c0-6b624133e048"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 612, 196, 32.02614379084967, 305.351307189543, 138, 1924, 154.0, 655.5000000000011, 1017.4000000000001, 1313.27, 2.3843660391472388, 2.518946237805448, 1.1388676197150447], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa27dd5-20cb-49b2-bfcb-204b9e7cb021", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["see books", 58, 58, 100.0, 812.5, 558, 1174, 875.0, 1047.2, 1082.8, 1174.0, 0.26545351359762737, 1.7099520252844471, 0.4456197166741421], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 25, 25, 100.0, 206.07999999999998, 139, 508, 147.0, 443.8, 489.99999999999994, 508.0, 0.11623527880193973, 0.057777106357604816, 0.05834466142987991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 214.83333333333334, 142, 452, 154.0, 435.8, 452.0, 452.0, 0.09346328191122026, 0.0725618253119337, 0.03322327599187908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d0b4919-7d7d-4764-a6bd-b13c9ad29104", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, 100.0, 148.3571428571429, 139, 157, 148.0, 156.0, 157.0, 157.0, 0.08618089369586762, 0.0428379637609342, 0.04325876890593355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50922bb5-eb3f-4de4-a294-23400ba7d51f", 3, 0, 0.0, 419.0, 248, 714, 295.0, 714.0, 714.0, 714.0, 0.02328053824604425, 0.02751680806360243, 0.014929251414292698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 246.93103448275843, 138, 724, 148.5, 589.4, 606.05, 724.0, 0.26630424801190106, 0.13237193577935316, 0.12873105738856544], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 536.3846153846155, 155, 1005, 521.0, 888.1999999999999, 1005.0, 1005.0, 0.10782297126932519, 0.020427398853758875, 0.07288904135010948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 536.3846153846155, 155, 1005, 521.0, 888.1999999999999, 1005.0, 1005.0, 0.10584509163742356, 0.020052683376621264, 0.07155198164401853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1002.1739130434781, 206, 1672, 1089.0, 1334.6000000000001, 1609.799999999999, 1672.0, 0.1026703211349088, 0.0325029685114589, 0.04632196129328893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03829e24-c35f-4800-9f5e-0381daeee315", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/001c807a-a26d-4775-b012-86f96aaff95e", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.5980073735955056, 1.1173776919475655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 197.5, 146, 439, 150.5, 439.0, 439.0, 439.0, 0.034228210891416706, 0.026941345682111196, 0.01216705934030828], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 528.3076923076923, 152, 868, 452.0, 864.8, 868.0, 868.0, 0.10487507764789403, 0.021499706047258326, 0.07069928987471462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1115.6956521739132, 708, 1924, 1081.0, 1482.4000000000003, 1852.799999999999, 1924.0, 0.10044282183190238, 0.0519870073934651, 0.04619977449494729], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 285.38461538461536, 215, 453, 248.0, 423.0, 453.0, 453.0, 0.10705580077738981, 0.22063370600418342, 0.06851024390193688], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 195.33333333333331, 144, 432, 149.0, 432.0, 432.0, 432.0, 0.034226258385433306, 0.01701285695135308, 0.0171799773536257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fad0ebae-da46-4f9a-b64f-59c0369458c4", 3, 0, 0.0, 325.3333333333333, 234, 432, 310.0, 432.0, 432.0, 432.0, 0.033224798989966116, 0.027373686928256584, 0.021306267581456134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3f482fd-cec8-49f8-a5b9-0eda7e3cbde9", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03829e24-c35f-4800-9f5e-0381daeee315", 3, 0, 0.0, 569.3333333333334, 219, 1079, 410.0, 1079.0, 1079.0, 1079.0, 0.028238483405184586, 0.023541261718970613, 0.018108662860746624], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 815.4915254237288, 590, 1363, 733.0, 1085.0, 1120.0, 1363.0, 0.2649077986161935, 0.8845182648875938, 0.5176216653608359], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d0f4960-2acb-4831-a251-e18d0f6932d1", 3, 0, 0.0, 380.0, 212, 706, 222.0, 706.0, 706.0, 706.0, 0.02719485110819018, 0.02727452352354621, 0.017439406472374564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3f482fd-cec8-49f8-a5b9-0eda7e3cbde9", 3, 0, 0.0, 317.3333333333333, 229, 443, 280.0, 443.0, 443.0, 443.0, 0.11180263108858496, 0.049495956471508964, 0.07169634871240636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac865fd7-0684-4a4e-8d9a-1f2f1ac327f1", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 152.64285714285717, 141, 170, 151.5, 168.0, 170.0, 170.0, 0.08444774192770067, 0.0630884009518467, 0.03001853326336235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d0f4960-2acb-4831-a251-e18d0f6932d1", 1, 0, 0.0, 1227.0, 1227, 1227, 1227.0, 1227.0, 1227.0, 1227.0, 0.8149959250203749, 0.1472404747351263, 0.5619014873675631], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 499.4615384615385, 152, 1227, 500.0, 1053.3999999999999, 1227.0, 1227.0, 0.10578221882272527, 0.020040771925399124, 0.07235179555145084], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 216.46022727272728, 139, 914, 155.0, 366.1000000000001, 452.15, 887.8199999999997, 0.7273057866266649, 1.6154934341023766, 0.34833792161007315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 150.7142857142857, 145, 155, 150.0, 155.0, 155.0, 155.0, 0.04241910071506484, 0.032849948112350015, 0.015078664707308204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c929e4f-c17b-4091-a9f4-d5e10e74681c", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 197.58823529411765, 143, 435, 149.0, 427.8, 435.0, 435.0, 0.0920037883912867, 0.04573235184684075, 0.04618158909484508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 151.92857142857144, 140, 175, 150.0, 166.5, 175.0, 175.0, 0.07093564110619065, 0.05756593531176214, 0.02521540367446621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b36afc9f-2bc4-4f7e-84ca-c6c0f710ec49", 3, 0, 0.0, 533.6666666666666, 359, 748, 494.0, 748.0, 748.0, 748.0, 0.02754795640076767, 0.027628663304285546, 0.017665844436690205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 458.217391304348, 154, 1006, 420.0, 776.2, 965.3999999999994, 1006.0, 0.09956494448172117, 0.061158544999025996, 0.045018134077184475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c929e4f-c17b-4091-a9f4-d5e10e74681c", 3, 0, 0.0, 496.66666666666663, 288, 868, 334.0, 868.0, 868.0, 868.0, 0.02876511367014085, 0.028849386464096342, 0.018446378232479646], "isController": false}, {"data": ["login", 23, 5, 21.73913043478261, 1936.608695652174, 1417, 3151, 1790.0, 2472.8, 3022.3999999999983, 3151.0, 0.10263779123473263, 0.15291078544685371, 0.15407435076018902], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c86608c5-d878-422f-bddf-a613a1e3f288", 3, 0, 0.0, 508.33333333333337, 314, 860, 351.0, 860.0, 860.0, 860.0, 0.028969552999797213, 0.029054424737101306, 0.018577480276562666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fad0ebae-da46-4f9a-b64f-59c0369458c4", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 189.14285714285717, 149, 423, 150.0, 423.0, 423.0, 423.0, 0.04284621270084162, 0.021297580336648813, 0.02150679035960214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7363654a-27bb-4337-8c16-d8b775e289c5", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 25, 0, 0.0, 234.20000000000002, 140, 492, 153.0, 466.20000000000005, 488.4, 492.0, 0.11511241878818854, 0.09319159685098467, 0.040918867616113894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 150.05555555555557, 139, 184, 149.0, 157.00000000000006, 184.0, 184.0, 0.0897997465651597, 0.04463678808756473, 0.045075263412589925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c86608c5-d878-422f-bddf-a613a1e3f288", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3925714e-796e-4d66-ba13-7c43e6e00747", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50922bb5-eb3f-4de4-a294-23400ba7d51f", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 202.76470588235293, 143, 461, 150.0, 449.8, 461.0, 461.0, 0.0909431337933986, 0.07540109432675332, 0.032327442090622154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a40ef44-77f9-4dfe-947c-d752860a763b", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 164.31249999999997, 138, 441, 146.5, 239.4000000000002, 441.0, 441.0, 0.09319827350198337, 0.04632609493409135, 0.04678116462892525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b36afc9f-2bc4-4f7e-84ca-c6c0f710ec49", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa27dd5-20cb-49b2-bfcb-204b9e7cb021", 3, 0, 0.0, 327.0, 215, 452, 314.0, 452.0, 452.0, 452.0, 0.02395094845755892, 0.024021117251868174, 0.01535916942102574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 149.625, 140, 169, 150.0, 161.3, 169.0, 169.0, 0.09480582581799651, 0.07360413234893284, 0.033700508396240954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78f327c9-e107-4d92-b778-c9517f62b035", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.3913430606617647, 0.7312251072303922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44ef1e0d-221d-4cb0-a2f6-2f6739fab810", 3, 0, 0.0, 374.6666666666667, 239, 507, 378.0, 507.0, 507.0, 507.0, 0.03219886016035032, 0.02684286486675038, 0.020648357589807986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 167.07142857142856, 138, 426, 148.0, 289.5, 426.0, 426.0, 0.0713103272634662, 0.035446246657328415, 0.035794441614669555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 190.85714285714286, 141, 453, 146.0, 453.0, 453.0, 453.0, 0.08644323149497395, 0.042968364092716545, 0.04896198658895009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7363654a-27bb-4337-8c16-d8b775e289c5", 3, 0, 0.0, 354.3333333333333, 285, 422, 356.0, 422.0, 422.0, 422.0, 0.02062550274662945, 0.02437864598730844, 0.013226640758743495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44ef1e0d-221d-4cb0-a2f6-2f6739fab810", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a40ef44-77f9-4dfe-947c-d752860a763b", 3, 0, 0.0, 321.0, 229, 408, 326.0, 408.0, 408.0, 408.0, 0.08369835114248249, 0.037871324247412325, 0.053673747314677896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e935e6e-0ef2-4732-99c0-6b624133e048", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.5806107954545454, 1.084872159090909], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1002.1739130434781, 206, 1672, 1089.0, 1334.6000000000001, 1609.799999999999, 1672.0, 0.10313207631773648, 0.03264914916037038, 0.04653029224491626], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5510204081632653, 0.8169934640522876], "isController": false}, {"data": ["401/Unauthorized", 9, 4.591836734693878, 1.4705882352941178], "isController": false}, {"data": ["404/Not Found", 182, 92.85714285714286, 29.73856209150327], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 612, 196, "404/Not Found", 182, "401/Unauthorized", 9, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 25, 25, "404/Not Found", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

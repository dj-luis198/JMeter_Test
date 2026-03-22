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

    var data = {"OkPercent": 99.32330827067669, "KoPercent": 0.6766917293233082};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8541260558804419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4915254237288136, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81ae6496-b69d-402a-b078-5955f049781b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e352da8-610a-489c-9066-32c24244c478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d17df0c-aec4-47b0-92a3-9468d26a379a"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2529e517-b60b-4c17-92f4-232c6212a289"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e12e2f6-ebc5-4454-845c-db49b740888f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25340331-d9e8-40ac-8819-b64543300dd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf45e75b-1cfb-48fb-ac78-0501b187bb52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8fa487a1-1e24-4ced-9f6f-8aeabcdf582c"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5bf0ba8-9f05-433b-aacb-6d3cf424b583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5bf0ba8-9f05-433b-aacb-6d3cf424b583"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/277a219b-db91-4315-8b51-edaae92e7c3e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.1, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/749b1815-7ef9-442e-9448-f3818052d3ab"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a897443-96c9-4787-be06-8b54c5bfd68d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56e5982a-1934-4ce5-a6d1-8ae392e77cb2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/741f4528-6063-48a1-857e-6c2a3f144056"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54d0efdb-e1cf-46f9-8d76-638f8cd26f32"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e352da8-610a-489c-9066-32c24244c478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e12e2f6-ebc5-4454-845c-db49b740888f"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2529e517-b60b-4c17-92f4-232c6212a289"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e18665a-c033-4e66-a22c-24616e95835b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf45e75b-1cfb-48fb-ac78-0501b187bb52"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8559322033898306, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9664804469273743, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=800e0135-e8ef-4016-8216-c7832e0bb96a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=741f4528-6063-48a1-857e-6c2a3f144056"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=749b1815-7ef9-442e-9448-f3818052d3ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/800e0135-e8ef-4016-8216-c7832e0bb96a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=277a219b-db91-4315-8b51-edaae92e7c3e"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e18665a-c033-4e66-a22c-24616e95835b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56e5982a-1934-4ce5-a6d1-8ae392e77cb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a897443-96c9-4787-be06-8b54c5bfd68d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 9, 0.6766917293233082, 259.2766917293233, 78, 2380, 95.0, 645.9000000000001, 808.45, 1180.0100000000016, 5.172380267174831, 719.8690809606336, 3.78447544577751], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1173.8644067796615, 947, 1545, 1152.0, 1380.0, 1407.0, 1545.0, 0.2576801795899828, 310.0774369543404, 1.2670114299175423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81ae6496-b69d-402a-b078-5955f049781b", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e352da8-610a-489c-9066-32c24244c478", 3, 0, 0.0, 236.66666666666669, 164, 365, 181.0, 365.0, 365.0, 365.0, 0.056435531810828096, 0.03628260915572444, 0.03619075444900109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d17df0c-aec4-47b0-92a3-9468d26a379a", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 460.8333333333333, 377, 925, 417.0, 790.0000000000005, 925.0, 925.0, 0.06396349816371456, 0.011555905429967966, 0.04347519015814975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 460.8333333333333, 377, 925, 417.0, 790.0000000000005, 925.0, 925.0, 0.06305534683068063, 0.011391835120777263, 0.04285793104897824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 97.4, 78, 237, 82.0, 221.90000000000032, 236.95, 237.0, 0.09181429640409308, 0.031462535750191666, 0.051977292602981215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 91.04999999999998, 78, 250, 82.5, 94.10000000000002, 242.2499999999999, 250.0, 0.09181429640409308, 0.06823308551124496, 0.04608647299971079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 128.25, 79, 385, 82.0, 241.5, 377.8499999999999, 385.0, 0.09181471789927927, 1.373338368796768, 0.05367215833448102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 122.05000000000003, 78, 729, 82.0, 219.1000000000003, 704.1999999999996, 729.0, 0.09181556090126154, 4.154299959428999, 0.0535829874947206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2529e517-b60b-4c17-92f4-232c6212a289", 3, 0, 0.0, 348.33333333333337, 181, 669, 195.0, 669.0, 669.0, 669.0, 0.02161009623696191, 0.025542402160289284, 0.01385803697487466], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 242.91666666666663, 158, 814, 181.0, 657.4000000000005, 814.0, 814.0, 0.0640187788417936, 0.1582860138974099, 0.04138714022780016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e12e2f6-ebc5-4454-845c-db49b740888f", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 99.05555555555556, 79, 239, 83.0, 236.3, 239.0, 239.0, 0.10104468982087021, 0.07509278218133031, 0.050719697820241494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 106.6111111111111, 79, 243, 81.0, 234.0, 243.0, 243.0, 0.1009585452995384, 0.0438626318770998, 0.05663581588526622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 505.3333333333333, 403, 572, 541.0, 572.0, 572.0, 572.0, 0.05006926247976367, 14.722025625031293, 0.02855512625799022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 708.6666666666666, 705, 716, 705.0, 716.0, 716.0, 716.0, 0.049949218294733685, 44.94439442296166, 0.028437885025224357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25340331-d9e8-40ac-8819-b64543300dd4", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 136.0, 81, 245, 82.0, 245.0, 245.0, 245.0, 0.050482953589338, 0.08933116396863326, 0.027952963559721333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf45e75b-1cfb-48fb-ac78-0501b187bb52", 3, 0, 0.0, 286.0, 175, 395, 288.0, 395.0, 395.0, 395.0, 0.02311034419005947, 0.023178050276553782, 0.014820110043755583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 107.58823529411764, 79, 346, 83.0, 269.99999999999994, 346.0, 346.0, 0.09882284551664003, 0.0734415873419561, 0.049604436128469695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 118.29411764705883, 78, 246, 81.0, 245.2, 246.0, 246.0, 0.09872757577341441, 0.035139939079278246, 0.05581783092612273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 140.8235294117647, 79, 785, 81.0, 351.39999999999964, 785.0, 785.0, 0.09882227105205027, 5.255683779268831, 0.057597125579854205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 141.47058823529412, 78, 541, 81.0, 360.99999999999983, 541.0, 541.0, 0.09882112214290696, 1.7342857158427698, 0.057692960956937246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 83.33333333333333, 83, 84, 83.0, 84.0, 84.0, 84.0, 0.05048125462744834, 0.03751585426903144, 0.028346407627717576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 467.3749999999999, 79, 736, 618.0, 730.4, 736.0, 736.0, 0.0821709566753631, 46.219287401266456, 0.043894055958421496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 169.16666666666666, 78, 706, 82.0, 580.0000000000002, 706.0, 706.0, 0.10104582428131158, 10.126565596282637, 0.05843904550991653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fa487a1-1e24-4ced-9f6f-8aeabcdf582c", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.5421662775891342, 1.0130385186757216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 344.9375, 78, 641, 403.5, 589.2, 641.0, 641.0, 0.08217264472657053, 15.109234247247217, 0.04397520440445376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 176.88888888888889, 79, 549, 83.5, 545.4, 549.0, 549.0, 0.10095344924284913, 3.322371880257992, 0.05848420849691531], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 469.41666666666663, 319, 1221, 376.5, 1082.1000000000004, 1221.0, 1221.0, 0.06305766623577261, 0.011392254153923764, 0.04347530504146042], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b5bf0ba8-9f05-433b-aacb-6d3cf424b583", 3, 0, 0.0, 250.33333333333331, 158, 384, 209.0, 384.0, 384.0, 384.0, 0.03247069519758418, 0.02706948255241311, 0.020822678886471626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5bf0ba8-9f05-433b-aacb-6d3cf424b583", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 293.0, 161, 1131, 167.0, 622.9999999999995, 1131.0, 1131.0, 0.09868172820730128, 7.088508984390873, 0.2204523051616349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/277a219b-db91-4315-8b51-edaae92e7c3e", 3, 0, 0.0, 457.6666666666667, 169, 814, 390.0, 814.0, 814.0, 814.0, 0.07623500711526733, 0.034494355433014844, 0.048887683599308805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 348.05, 134, 674, 346.5, 564.0000000000001, 668.7499999999999, 674.0, 0.08963384574015149, 0.055058290010307896, 0.040527803298525525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.75, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.08217053467339781, 0.06106618836567942, 0.04124575666223288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 147.375, 78, 329, 82.0, 273.70000000000005, 329.0, 329.0, 0.0821709566753631, 0.09912272874340064, 0.042549950954210235], "isController": false}, {"data": ["login", 20, 0, 0.0, 1903.2499999999998, 1244, 3737, 1744.0, 2876.0000000000014, 3696.7999999999993, 3737.0, 0.09089132578632358, 16.438188892341497, 0.15974328029067045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 97.27777777777779, 82, 242, 86.0, 127.70000000000019, 242.0, 242.0, 0.09843327044541055, 0.07968865351488803, 0.03498995160364203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/749b1815-7ef9-442e-9448-f3818052d3ab", 3, 0, 0.0, 308.0, 185, 395, 344.0, 395.0, 395.0, 395.0, 0.019911989008582067, 0.02353529690434944, 0.012769081493133681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 552.6249999999999, 162, 820, 713.0, 815.1, 820.0, 820.0, 0.08213510197586255, 61.461570477692625, 0.17158937197447652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a897443-96c9-4787-be06-8b54c5bfd68d", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56e5982a-1934-4ce5-a6d1-8ae392e77cb2", 3, 0, 0.0, 351.6666666666667, 292, 387, 376.0, 387.0, 387.0, 387.0, 0.0651748859439496, 0.029489938626982404, 0.04179509287421247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/741f4528-6063-48a1-857e-6c2a3f144056", 3, 0, 0.0, 420.3333333333333, 229, 545, 487.0, 545.0, 545.0, 545.0, 0.019871234401080993, 0.027394100810083987, 0.012742946539755716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 246.25, 162, 808, 168.5, 470.80000000000035, 791.9499999999998, 808.0, 0.09177974696323762, 5.625152906492499, 0.20524066657335724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 792.3333333333334, 788, 800, 789.0, 800.0, 800.0, 800.0, 0.04987945797655666, 59.673172645273915, 0.11247233248815362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54d0efdb-e1cf-46f9-8d76-638f8cd26f32", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.995849609375, 3.729248046875], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 944.2272727272727, 146, 1625, 943.0, 1336.1, 1583.1499999999994, 1625.0, 0.08819897689186805, 0.02803199016982312, 0.03979289777738578], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.29411764705884, 81, 246, 85.0, 123.5999999999999, 246.0, 246.0, 0.0878421321869074, 0.06819774910995252, 0.031225132925814737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 305.00000000000006, 160, 785, 244.5, 663.5000000000002, 785.0, 785.0, 0.10090704219035553, 13.5523325643843, 0.22407363481180836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 276.15384615384613, 162, 486, 324.0, 423.5999999999999, 486.0, 486.0, 0.07017430217054514, 0.1087564624459523, 0.15782365029176318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e352da8-610a-489c-9066-32c24244c478", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 95.72727272727273, 79, 236, 82.0, 205.6000000000001, 236.0, 236.0, 0.06312769010043043, 0.0469142306312769, 0.03168714131994261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 95.0, 78, 244, 80.0, 212.0000000000001, 244.0, 244.0, 0.06313022617838306, 0.016892267551637655, 0.03600395711735909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 110.0, 78, 246, 82.0, 243.8, 246.0, 246.0, 0.06306941649322577, 0.01699917866418976, 0.03707791868058781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 110.45454545454545, 78, 247, 82.0, 246.0, 247.0, 247.0, 0.06306905488154485, 0.016999081198541384, 0.03713929696637846], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 757.8135593220339, 618, 1189, 652.0, 1028.0, 1054.0, 1189.0, 0.25262472810728415, 302.2270013819429, 0.4988351564774693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e12e2f6-ebc5-4454-845c-db49b740888f", 3, 0, 0.0, 267.3333333333333, 200, 389, 213.0, 389.0, 389.0, 389.0, 0.01797925194325748, 0.024785850253807105, 0.011529663518299881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 944.2272727272727, 146, 1625, 943.0, 1336.1, 1583.1499999999994, 1625.0, 0.08647866728512017, 0.027485229836712553, 0.03901674246652882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.85714285714285, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.041113590978503464, 0.011081397568424762, 0.02421044468753671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 105.28571428571429, 79, 245, 82.0, 245.0, 245.0, 245.0, 0.041113590978503464, 0.011081397568424762, 0.024170294696346763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 161.76470588235293, 78, 820, 82.0, 360.7999999999996, 820.0, 820.0, 0.08709819553032555, 4.632160024041664, 0.05076391841973133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 128.1764705882353, 79, 391, 82.0, 275.7999999999999, 391.0, 391.0, 0.08709953427366673, 1.5285748114551259, 0.05084975682578556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 104.0, 78, 245, 81.0, 245.0, 245.0, 245.0, 0.04111407393485181, 0.01100122681459902, 0.023447870290970174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 109.94117647058823, 80, 244, 82.0, 242.4, 244.0, 244.0, 0.08709507195589916, 0.06472592749847583, 0.04371764354036344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2529e517-b60b-4c17-92f4-232c6212a289", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 104.28571428571429, 79, 237, 83.0, 237.0, 237.0, 237.0, 0.04111262509984495, 0.030553425489240237, 0.02063661064582061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 141.58823529411762, 79, 326, 82.0, 260.3999999999999, 326.0, 326.0, 0.08709908802131365, 0.031001031099497898, 0.04924340672712368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.42857142857143, 85, 99, 87.0, 99.0, 99.0, 99.0, 0.040858495356723847, 0.03216010474367131, 0.01452391827133543], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 419.83333333333337, 344, 669, 388.0, 631.8000000000002, 669.0, 669.0, 0.06292474200855777, 0.011368239523030454, 0.04283061052730933], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1214.05, 811, 2380, 1118.0, 2013.1000000000004, 2362.7, 2380.0, 0.09105353492585966, 0.047127317881548454, 0.0418810692871874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 210.71428571428572, 160, 483, 166.0, 483.0, 483.0, 483.0, 0.04109283458372959, 0.06368586766052622, 0.09241874809211839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e18665a-c033-4e66-a22c-24616e95835b", 3, 0, 0.0, 271.3333333333333, 166, 430, 218.0, 430.0, 430.0, 430.0, 0.01912740766243951, 0.022944172277372915, 0.01226594827311388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf45e75b-1cfb-48fb-ac78-0501b187bb52", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 791.4833333333336, 421, 1576, 684.0, 1229.9, 1304.5, 1576.0, 0.27467999780256, 83.16450617257458, 1.0004047595748868], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 153.79661016949154, 80, 334, 85.0, 322.0, 330.0, 334.0, 0.25340268263246735, 0.18831976707354262, 0.1224944608428431], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 451.25423728813564, 383, 669, 406.0, 566.0, 630.0, 669.0, 0.2533896230507252, 74.50496250424106, 0.127437163936644], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 126.6271186440678, 78, 321, 85.0, 246.0, 254.0, 321.0, 0.25353988955974305, 0.448646757697514, 0.12330357910229689], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 600.0677966101696, 537, 818, 565.0, 722.0, 731.0, 818.0, 0.2530266707265297, 227.673843093176, 0.12700752807952756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 86.00000000000001, 83, 95, 85.0, 93.8, 95.0, 95.0, 0.0719806870279728, 0.05377463435195234, 0.025586884841974706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, 2.793296089385475, 134.3016759776537, 81, 572, 87.0, 236.0, 272.0, 566.3999999999999, 0.7278582668840753, 1.5376450633724643, 0.34981242528270584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 103.18181818181817, 82, 255, 86.0, 226.2000000000001, 255.0, 255.0, 0.061727355880652965, 0.04780253243491973, 0.021942146035700858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=800e0135-e8ef-4016-8216-c7832e0bb96a", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 85.60000000000001, 80, 99, 84.5, 92.80000000000001, 98.69999999999999, 99.0, 0.09076675213869159, 0.07365934670630148, 0.03226474392430053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=741f4528-6063-48a1-857e-6c2a3f144056", 1, 0, 0.0, 1221.0, 1221, 1221, 1221.0, 1221.0, 1221.0, 1221.0, 0.819000819000819, 0.14796401515151514, 0.564662674037674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=749b1815-7ef9-442e-9448-f3818052d3ab", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/800e0135-e8ef-4016-8216-c7832e0bb96a", 3, 0, 0.0, 255.33333333333334, 170, 372, 224.0, 372.0, 372.0, 372.0, 0.022679679762921748, 0.022746124137227184, 0.014543935264634066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 222.54545454545453, 163, 481, 167.0, 450.2000000000001, 481.0, 481.0, 0.06303833303724418, 0.09769710403330716, 0.14177468846169275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=277a219b-db91-4315-8b51-edaae92e7c3e", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 311.35294117647055, 162, 903, 317.0, 571.7999999999997, 903.0, 903.0, 0.08705849818969534, 6.253588762540265, 0.19448632445422004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e18665a-c033-4e66-a22c-24616e95835b", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56e5982a-1934-4ce5-a6d1-8ae392e77cb2", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.5663450235109718, 2.161295062695925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 94.23529411764704, 81, 240, 85.0, 120.7999999999999, 240.0, 240.0, 0.09940299729273014, 0.08241518037258583, 0.035334659193900164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.1875, 80, 99, 85.0, 99.0, 99.0, 99.0, 0.08377577414051292, 0.06504076215010525, 0.029779669714010453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a897443-96c9-4787-be06-8b54c5bfd68d", 3, 0, 0.0, 241.66666666666666, 164, 368, 193.0, 368.0, 368.0, 368.0, 0.020352229247510244, 0.024055645962796125, 0.013051397010935932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 93.92307692307692, 79, 237, 83.0, 175.79999999999995, 237.0, 237.0, 0.07020575687206351, 0.052174395487930014, 0.035239999054922505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 155.61538461538458, 79, 248, 85.0, 246.4, 248.0, 248.0, 0.07020537773193426, 0.018785423338427726, 0.040039004487743765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 140.76923076923077, 78, 244, 81.0, 244.0, 244.0, 244.0, 0.07020537773193426, 0.01892254321681041, 0.04127308339318792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 130.23076923076925, 79, 245, 82.0, 243.8, 245.0, 245.0, 0.07020499859590003, 0.01892244102780118, 0.0413414200716091], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3007518796992481], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.37593984962406013], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

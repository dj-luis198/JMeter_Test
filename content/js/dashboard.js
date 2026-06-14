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

    var data = {"OkPercent": 97.92626728110599, "KoPercent": 2.0737327188940093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7703947368421052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05454545454545454, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab76b2a8-9255-463a-9409-d426bd69e5e3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ec7dcf2b-638c-46e9-a94d-142f0ae7598d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5987ce91-b5bb-47b8-846b-4800afedfcd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb5b1c19-4aa0-4269-bf33-a93f43c84a75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba8abed-d7f2-4417-8b81-522d604adb70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc6ddc79-7c1e-487d-9b9e-2cc62737389d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=496df89e-bb27-4a2e-a308-525dffbefbfc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=546deba4-146a-4ceb-9ae6-93fd42c52f0a"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77fa9bdb-b1bf-4bac-a85e-87a43d1263eb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6d8de18-6dba-4609-aafa-efe6dc6a123d"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/763e02c8-4041-4e72-8846-da7324a5b1e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1581d182-ade5-4094-aaeb-fa4d1c53b084"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec7dcf2b-638c-46e9-a94d-142f0ae7598d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab76b2a8-9255-463a-9409-d426bd69e5e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81286d62-5f05-4123-95c1-9663e7020a0b"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc6ddc79-7c1e-487d-9b9e-2cc62737389d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eba8abed-d7f2-4417-8b81-522d604adb70"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb5b1c19-4aa0-4269-bf33-a93f43c84a75"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9161849710982659, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5987ce91-b5bb-47b8-846b-4800afedfcd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=763e02c8-4041-4e72-8846-da7324a5b1e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/496df89e-bb27-4a2e-a308-525dffbefbfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f8ffd88-778c-4f89-adfa-72ae5a8f5c16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/546deba4-146a-4ceb-9ae6-93fd42c52f0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77fa9bdb-b1bf-4bac-a85e-87a43d1263eb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81286d62-5f05-4123-95c1-9663e7020a0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/81dc156b-fb7b-4ca9-a6a0-ab9566bab766"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1581d182-ade5-4094-aaeb-fa4d1c53b084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6d8de18-6dba-4609-aafa-efe6dc6a123d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 27, 2.0737327188940093, 377.6397849462366, 98, 3039, 120.0, 1075.5000000000002, 1286.0, 1695.7000000000003, 5.093219211841931, 695.9239508132232, 3.7275658876557896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1784.8181818181822, 1250, 2559, 1728.0, 2159.0, 2359.599999999999, 2559.0, 0.23324258076554455, 280.66998715973085, 1.1468519474165204], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ab76b2a8-9255-463a-9409-d426bd69e5e3", 3, 0, 0.0, 413.0, 359, 512, 368.0, 512.0, 512.0, 512.0, 0.028481913984619765, 0.023466056085635623, 0.01826476905914744], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 555.2666666666665, 113, 1023, 513.0, 964.2, 1023.0, 1023.0, 0.07823583409830594, 0.015326277656367354, 0.052676757568013016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 555.2666666666665, 113, 1023, 513.0, 964.2, 1023.0, 1023.0, 0.07715493740162746, 0.01511453168238913, 0.05194898194060099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 155.58823529411765, 102, 343, 106.0, 326.2, 343.0, 343.0, 0.11773831620356262, 0.041906399770063996, 0.06656597587749674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 109.41176470588235, 101, 123, 109.0, 115.8, 123.0, 123.0, 0.117739131639275, 0.0874994913842659, 0.05909952506112046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 185.2941176470588, 99, 646, 107.0, 382.7999999999998, 646.0, 646.0, 0.11774484000554093, 2.0663921812231614, 0.06874085529505472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 193.88235294117644, 99, 1183, 108.0, 488.5999999999994, 1183.0, 1183.0, 0.11774157801418439, 6.261872907056877, 0.06862396889544549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec7dcf2b-638c-46e9-a94d-142f0ae7598d", 3, 0, 0.0, 575.3333333333334, 458, 679, 589.0, 679.0, 679.0, 679.0, 0.07381344881037324, 0.03339866336146446, 0.04733479627488128], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 263.1333333333333, 106, 679, 224.0, 496.0000000000001, 679.0, 679.0, 0.07788849483080022, 0.1617707527403769, 0.05034355316928286], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5987ce91-b5bb-47b8-846b-4800afedfcd0", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 121.875, 103, 305, 108.0, 180.40000000000012, 305.0, 305.0, 0.09204289198766624, 0.06840296953380276, 0.04620121726724654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 130.81249999999997, 101, 307, 107.0, 307.0, 307.0, 307.0, 0.0920455395306828, 0.041910383599785994, 0.051528423374964764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 767.8333333333334, 624, 862, 819.5, 862.0, 862.0, 862.0, 0.05690817865374219, 16.732894053569563, 0.03245544563846234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1173.3333333333333, 958, 1278, 1198.5, 1278.0, 1278.0, 1278.0, 0.05669577049552103, 51.0149539524039, 0.0322789396473523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 212.83333333333334, 99, 338, 203.5, 338.0, 338.0, 338.0, 0.05731808672226521, 0.10142614564525836, 0.03173765153469177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb5b1c19-4aa0-4269-bf33-a93f43c84a75", 3, 0, 0.0, 533.3333333333334, 200, 829, 571.0, 829.0, 829.0, 829.0, 0.052792735719564984, 0.03394064226762397, 0.03385471659099708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 138.42857142857142, 101, 328, 109.0, 327.5, 328.0, 328.0, 0.06686662973081405, 0.04969287619643505, 0.03356391375160002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 135.28571428571428, 98, 317, 108.5, 311.0, 317.0, 317.0, 0.06680504855295494, 0.017875569632333645, 0.03809975425285711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 177.78571428571428, 100, 321, 107.5, 319.0, 321.0, 321.0, 0.06687014295881277, 0.018023593219367504, 0.03931233013789579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 166.8571428571429, 98, 324, 109.0, 323.5, 324.0, 324.0, 0.06686758784729353, 0.018022904536965836, 0.039376128390544926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 145.66666666666666, 102, 327, 111.0, 327.0, 327.0, 327.0, 0.057316444087808796, 0.042595521436350085, 0.032184526709462945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 723.8888888888887, 98, 1290, 946.5, 1288.2, 1290.0, 1290.0, 0.0823466978974143, 41.17414418049024, 0.04447936872106429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 256.43749999999994, 104, 1077, 109.0, 1069.3, 1077.0, 1077.0, 0.09192813518032278, 10.361317520497101, 0.05305617958161207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 540.3333333333333, 100, 973, 812.5, 957.7, 973.0, 973.0, 0.08234933502911963, 13.461775182884148, 0.044561212433834596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 219.125, 100, 811, 107.0, 789.3000000000001, 811.0, 811.0, 0.09192813518032278, 3.4004208225844446, 0.05314595315112411], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 466.3999999999999, 110, 879, 493.0, 796.2, 879.0, 879.0, 0.07731360977244027, 0.015145615351905782, 0.05256922789475041], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba8abed-d7f2-4417-8b81-522d604adb70", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc6ddc79-7c1e-487d-9b9e-2cc62737389d", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 364.7142857142857, 210, 645, 407.5, 644.0, 645.0, 645.0, 0.06676936430795938, 0.10347947378587065, 0.15016586523557662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=496df89e-bb27-4a2e-a308-525dffbefbfc", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=546deba4-146a-4ceb-9ae6-93fd42c52f0a", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 763.8095238095236, 233, 1341, 786.0, 1063.4, 1314.0999999999997, 1341.0, 0.09242672981026114, 0.05677384086977954, 0.041790601466944244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 119.05555555555554, 99, 319, 108.0, 137.20000000000027, 319.0, 319.0, 0.08234707462017413, 0.061197386509719245, 0.04133437144020459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 166.0, 99, 335, 109.0, 324.20000000000005, 335.0, 335.0, 0.08234556774981587, 0.09074452973818684, 0.04312062825093439], "isController": false}, {"data": ["login", 21, 0, 0.0, 3042.1428571428573, 2098, 4921, 2770.0, 4630.000000000001, 4917.5, 4921.0, 0.09160744899428108, 31.437253396019003, 0.1816173908562679], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 131.9375, 108, 333, 115.0, 195.80000000000013, 333.0, 333.0, 0.08586224476106147, 0.06951152432316403, 0.03052134481740857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77fa9bdb-b1bf-4bac-a85e-87a43d1263eb", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6d8de18-6dba-4609-aafa-efe6dc6a123d", 3, 0, 0.0, 401.3333333333333, 287, 571, 346.0, 571.0, 571.0, 571.0, 0.019838514492034838, 0.027348993774012866, 0.012721964045998901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 858.5555555555555, 213, 1403, 1055.5, 1396.7, 1403.0, 1403.0, 0.08230603211764276, 54.76037513260416, 0.17340887864890075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/763e02c8-4041-4e72-8846-da7324a5b1e1", 3, 0, 0.0, 580.6666666666666, 215, 1089, 438.0, 1089.0, 1089.0, 1089.0, 0.03864933458728952, 0.032220359986343906, 0.024784892297187618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1581d182-ade5-4094-aaeb-fa4d1c53b084", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 379.3529411764706, 208, 1306, 414.0, 620.3999999999994, 1306.0, 1306.0, 0.11764950137373094, 8.451002659224757, 0.2628257961237949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 834.4, 106, 1605, 1165.5, 1581.5, 1605.0, 1605.0, 0.08804366966015144, 63.207926131361155, 0.14245190614544814], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1091.3478260869565, 324, 2389, 1128.0, 1772.2, 2271.7999999999984, 2389.0, 0.09709967492717524, 0.03029417507493562, 0.04380864239878414], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 380.5, 213, 1201, 220.0, 1182.8, 1201.0, 1201.0, 0.0918711277755129, 13.863310565323243, 0.20368205843003725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 112.2, 104, 121, 112.0, 118.6, 121.0, 121.0, 0.11060478697518028, 0.08586992738795736, 0.03931654537008362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec7dcf2b-638c-46e9-a94d-142f0ae7598d", 1, 0, 0.0, 879.0, 879, 879, 879.0, 879.0, 879.0, 879.0, 1.1376564277588168, 0.2055336319681456, 0.784360779294653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 330.5333333333333, 212, 438, 420.0, 435.0, 438.0, 438.0, 0.08318683207906076, 0.12892334229440375, 0.1870891350371845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab76b2a8-9255-463a-9409-d426bd69e5e3", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 107.9, 102, 112, 108.5, 112.0, 112.0, 112.0, 0.04647444834829811, 0.034538139836967637, 0.02332799458107932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 170.2, 106, 324, 109.5, 323.1, 324.0, 324.0, 0.04643107539013711, 0.012423940094626532, 0.02648022268343757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 127.00000000000001, 102, 316, 106.0, 295.5000000000001, 316.0, 316.0, 0.04647660832303102, 0.012526898337066954, 0.027323162314906908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 147.20000000000002, 100, 321, 108.0, 319.3, 321.0, 321.0, 0.0464336625480008, 0.012515323108640841, 0.027343260269965315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 110.5, 110, 111, 110.5, 111.0, 111.0, 111.0, 0.034894879176480854, 0.010291263194626189, 0.021570760272180058], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1221.3636363636363, 803, 2059, 1097.0, 1663.6, 1902.3999999999992, 2059.0, 0.2379736757846641, 284.6992492741803, 0.4699050512076082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81286d62-5f05-4123-95c1-9663e7020a0b", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1091.3478260869565, 324, 2389, 1128.0, 1772.2, 2271.7999999999984, 2389.0, 0.094041451836466, 0.02934003855699525, 0.04242885815278056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 131.88888888888889, 103, 323, 108.0, 323.0, 323.0, 323.0, 0.05188875051888751, 0.013985639788293897, 0.03055558258094645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 109.11111111111111, 102, 120, 107.0, 120.0, 120.0, 120.0, 0.051888152205246466, 0.013985478524070338, 0.030504558230037476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 120.26666666666667, 99, 316, 108.0, 192.4000000000001, 316.0, 316.0, 0.11570413680857136, 0.03118588062418525, 0.06802137730347653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 175.86666666666665, 102, 324, 108.0, 322.8, 324.0, 324.0, 0.11571038462131848, 0.03118756460496475, 0.06813804875649908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 130.55555555555554, 102, 305, 109.0, 305.0, 305.0, 305.0, 0.05188785305360015, 0.013884054430357853, 0.02959229119463134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 108.60000000000001, 101, 113, 110.0, 112.4, 113.0, 113.0, 0.11570324431897071, 0.08598649309251631, 0.058077605058545846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 109.0, 103, 113, 110.0, 113.0, 113.0, 113.0, 0.05189054554260214, 0.03856318863078147, 0.026046621493063964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 134.53333333333333, 100, 326, 108.0, 320.0, 326.0, 326.0, 0.11570592182907921, 0.030960373614421582, 0.06598853354314674], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 521.4666666666668, 106, 960, 494.0, 928.2, 960.0, 960.0, 0.07942937933882983, 0.015270505025232065, 0.054054381655520074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 114.44444444444444, 108, 145, 110.0, 145.0, 145.0, 145.0, 0.05506001541680432, 0.04333825432221121, 0.019572114855192158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1530.1428571428573, 943, 3039, 1383.0, 2488.2000000000003, 2985.5999999999995, 3039.0, 0.09068218915441018, 0.04693511743343495, 0.041710264738014834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 244.55555555555554, 210, 434, 220.0, 434.0, 434.0, 434.0, 0.05185407112073932, 0.08036368248888019, 0.11662102128033464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc6ddc79-7c1e-487d-9b9e-2cc62737389d", 3, 0, 0.0, 319.0, 198, 479, 280.0, 479.0, 479.0, 479.0, 0.02431118314424635, 0.02438240731361426, 0.015590179294975689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eba8abed-d7f2-4417-8b81-522d604adb70", 3, 0, 0.0, 529.6666666666666, 265, 960, 364.0, 960.0, 960.0, 960.0, 0.01876430778468582, 0.025868113108119945, 0.012033101020778345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb5b1c19-4aa0-4269-bf33-a93f43c84a75", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1098.4067796610173, 538, 2340, 870.0, 1871.0, 2125.0, 2340.0, 0.28415247910997665, 75.98990566378501, 1.0357107649842272], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 187.29090909090914, 100, 659, 111.0, 434.2, 443.2, 659.0, 0.23883863627481208, 0.1774962912159492, 0.11545422358987498], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 668.5454545454544, 489, 966, 624.0, 903.1999999999999, 945.9999999999999, 966.0, 0.23875465571578644, 70.20179618111928, 0.12007680438831057], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 162.27272727272728, 98, 346, 111.0, 318.4, 326.4, 346.0, 0.23919699394614155, 0.42326655569375826, 0.11632822557146336], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1029.8545454545454, 685, 1622, 988.0, 1293.0, 1400.3999999999999, 1622.0, 0.23844206291402212, 214.55058734647585, 0.11968673861114001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.5333333333333, 109, 329, 113.0, 312.2, 329.0, 329.0, 0.08693888196597792, 0.06494945771872374, 0.030904055698843712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 196.670520231214, 101, 1718, 113.0, 340.2, 434.19999999999993, 1669.1599999999994, 0.7303430079155673, 1.5351954155672822, 0.3516408311345646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 134.60000000000002, 105, 305, 113.0, 288.00000000000006, 305.0, 305.0, 0.046139081647718884, 0.035730753658829176, 0.01640100167946257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5987ce91-b5bb-47b8-846b-4800afedfcd0", 3, 0, 0.0, 341.3333333333333, 225, 461, 338.0, 461.0, 461.0, 461.0, 0.03292433986698567, 0.027447667447705174, 0.021113590344388596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 123.70588235294117, 104, 302, 112.0, 161.9999999999999, 302.0, 302.0, 0.12091468402148013, 0.09812510002133788, 0.04298139158576052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=763e02c8-4041-4e72-8846-da7324a5b1e1", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/496df89e-bb27-4a2e-a308-525dffbefbfc", 3, 0, 0.0, 510.33333333333337, 250, 907, 374.0, 907.0, 907.0, 907.0, 0.021991716453469194, 0.03013838745739105, 0.01410276087673643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 281.4, 215, 428, 221.0, 427.9, 428.0, 428.0, 0.046406511761730405, 0.07192102945885367, 0.1043693326047511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f8ffd88-778c-4f89-adfa-72ae5a8f5c16", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/546deba4-146a-4ceb-9ae6-93fd42c52f0a", 3, 0, 0.0, 348.6666666666667, 204, 494, 348.0, 494.0, 494.0, 494.0, 0.05296984250300162, 0.0340545048643972, 0.033968290928031636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 287.0666666666666, 213, 434, 220.0, 432.2, 434.0, 434.0, 0.11560515444848633, 0.1791654102634256, 0.25999870185045315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77fa9bdb-b1bf-4bac-a85e-87a43d1263eb", 3, 0, 0.0, 285.6666666666667, 224, 408, 225.0, 408.0, 408.0, 408.0, 0.02086753290114354, 0.02876757872276787, 0.013381848898194262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81286d62-5f05-4123-95c1-9663e7020a0b", 3, 0, 0.0, 397.3333333333333, 237, 570, 385.0, 570.0, 570.0, 570.0, 0.020748179347262277, 0.02452364557614236, 0.013305310323602437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 114.78571428571429, 101, 134, 113.0, 132.5, 134.0, 134.0, 0.06699558307691572, 0.05554614260966938, 0.023814836171872383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81dc156b-fb7b-4ca9-a6a0-ab9566bab766", 1, 0, 0.0, 2163.0, 2163, 2163, 2163.0, 2163.0, 2163.0, 2163.0, 0.4623208506703652, 0.1476356622746186, 0.2758574607027277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 124.61111111111113, 106, 315, 111.5, 150.30000000000027, 315.0, 315.0, 0.08250900723328963, 0.06405728588912624, 0.029329373664958427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1581d182-ade5-4094-aaeb-fa4d1c53b084", 3, 0, 0.0, 357.0, 207, 522, 342.0, 522.0, 522.0, 522.0, 0.07175660160734788, 0.03246799356582472, 0.04601578944221202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6d8de18-6dba-4609-aafa-efe6dc6a123d", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 108.40000000000002, 104, 115, 108.0, 113.2, 115.0, 115.0, 0.08323761008173934, 0.06185920046113636, 0.041781378498060566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 161.53333333333333, 100, 326, 105.0, 326.0, 326.0, 326.0, 0.08324038157390913, 0.022273305225831156, 0.04747303011637005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 148.06666666666666, 100, 326, 108.0, 323.6, 326.0, 326.0, 0.08323853389195637, 0.02243538608806637, 0.04893515371382592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 189.73333333333335, 100, 324, 109.0, 323.4, 324.0, 324.0, 0.08323945772267943, 0.02243563508931594, 0.04901698535817939], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6144393241167435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15360983102918588], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15360983102918588], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.152073732718894], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

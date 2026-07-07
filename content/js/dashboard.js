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

    var data = {"OkPercent": 97.75112443778112, "KoPercent": 2.2488755622188905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.791907514450867, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bef4674-87da-4ae5-b9d8-a6617d4f9eff"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e756662-1474-426a-82c4-2f0307076770"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94fa632a-57a3-4d7e-aa01-54497c0f9f9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6902251f-d2fe-472f-a81c-523409d3a126"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a252486-8d6d-48b4-844b-d3fc7b0e19a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb9b5231-2add-4518-80b5-ce776dee1854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da1af520-36a7-427b-ba0e-7c8ab450a2d7"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2c29b72-ff27-4e85-b5b7-cc4f27fe12f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61f7f9e8-a4c5-4821-9577-f3876522b9ab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2b85b38-188d-4162-888c-48acfba85dd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e4408ad-e4b2-43a1-ae15-fc5d32ad71d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac7bee95-65d5-49ae-8835-5a089c435c17"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a38d3fd-ce4d-4345-8935-eb5397c7b445"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a252486-8d6d-48b4-844b-d3fc7b0e19a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dc96b628-36fc-4a03-a7ec-5b56f800142b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=817706ce-618e-457f-aedd-af6f41ed211b"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94fa632a-57a3-4d7e-aa01-54497c0f9f9b"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6902251f-d2fe-472f-a81c-523409d3a126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7807017543859649, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9248554913294798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb9b5231-2add-4518-80b5-ce776dee1854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e4408ad-e4b2-43a1-ae15-fc5d32ad71d5"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2c29b72-ff27-4e85-b5b7-cc4f27fe12f3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61f7f9e8-a4c5-4821-9577-f3876522b9ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a38d3fd-ce4d-4345-8935-eb5397c7b445"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/817706ce-618e-457f-aedd-af6f41ed211b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bef4674-87da-4ae5-b9d8-a6617d4f9eff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac7bee95-65d5-49ae-8835-5a089c435c17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2b85b38-188d-4162-888c-48acfba85dd1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 30, 2.2488755622188905, 323.2968515742134, 81, 3092, 103.0, 886.5, 1076.5, 1602.0500000000052, 5.2069102803300575, 750.4785307957616, 3.808653975636032], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8bef4674-87da-4ae5-b9d8-a6617d4f9eff", 3, 0, 0.0, 443.6666666666667, 185, 673, 473.0, 673.0, 673.0, 673.0, 0.029550245267035716, 0.029636818251216484, 0.018949864315123816], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1416.7894736842106, 1004, 1937, 1370.0, 1745.6000000000001, 1858.7999999999997, 1937.0, 0.24822648707262582, 298.7004861986618, 1.220527697666671], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 566.4666666666667, 89, 1778, 478.0, 1256.6000000000004, 1778.0, 1778.0, 0.08272575859520633, 0.016835984464102536, 0.055435952683623606], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 566.4666666666667, 89, 1778, 478.0, 1256.6000000000004, 1778.0, 1778.0, 0.08164109486150949, 0.01661523844642439, 0.05470910087301544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 85.19999999999999, 82, 89, 85.0, 89.0, 89.0, 89.0, 0.10473763223126069, 0.0280254992493803, 0.05973318088189086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 86.66666666666667, 83, 102, 85.0, 94.2, 102.0, 102.0, 0.1047361695888058, 0.07783615728230586, 0.05257264762563103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 118.26666666666667, 82, 262, 87.0, 253.0, 262.0, 262.0, 0.10473909491456782, 0.028230459176192105, 0.0616774162436371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 128.93333333333337, 82, 256, 85.0, 250.0, 256.0, 256.0, 0.10473763223126069, 0.028230064937331982, 0.06157427207345599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e756662-1474-426a-82c4-2f0307076770", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.7290774828767124, 1.3622823915525115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94fa632a-57a3-4d7e-aa01-54497c0f9f9b", 3, 0, 0.0, 328.6666666666667, 179, 567, 240.0, 567.0, 567.0, 567.0, 0.03664390672904274, 0.030548517295923977, 0.02349885945840306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6902251f-d2fe-472f-a81c-523409d3a126", 3, 0, 0.0, 327.6666666666667, 198, 421, 364.0, 421.0, 421.0, 421.0, 0.03843591451852611, 0.032042440456362425, 0.024648031120278788], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 191.66666666666666, 83, 345, 185.0, 321.6, 345.0, 345.0, 0.08274629434511825, 0.14144444689618652, 0.05347802499765553], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a252486-8d6d-48b4-844b-d3fc7b0e19a3", 3, 0, 0.0, 324.0, 198, 429, 345.0, 429.0, 429.0, 429.0, 0.03785488958990536, 0.031558063880126185, 0.02427543375394322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb9b5231-2add-4518-80b5-ce776dee1854", 3, 0, 0.0, 267.6666666666667, 183, 437, 183.0, 437.0, 437.0, 437.0, 0.016209819908900813, 0.02234654534967283, 0.01039496914730944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 97.26666666666667, 83, 249, 87.0, 153.60000000000005, 249.0, 249.0, 0.07740377420803038, 0.05752370329327258, 0.038853066350515254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 120.13333333333334, 81, 262, 87.0, 259.6, 262.0, 262.0, 0.07740377420803038, 0.03621246884498088, 0.043277578964750325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 572.375, 487, 775, 513.5, 775.0, 775.0, 775.0, 0.0773859041575577, 22.754025276170946, 0.04413414846485712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 918.625, 758, 1068, 922.0, 1068.0, 1068.0, 1068.0, 0.07695341432680192, 69.24281748092999, 0.0438123442895757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 191.875, 85, 262, 248.5, 262.0, 262.0, 262.0, 0.0776880049720323, 0.13747135254816656, 0.043016698065568675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 108.23529411764706, 83, 262, 87.0, 258.0, 262.0, 262.0, 0.07971789244649523, 0.05924347280447546, 0.04001464523193217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 113.4705882352941, 81, 252, 85.0, 251.2, 252.0, 252.0, 0.07971714481322742, 0.021330564139476867, 0.045463684151293766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 133.52941176470588, 82, 258, 87.0, 250.79999999999998, 258.0, 258.0, 0.07971938775510204, 0.021486866230867346, 0.04686628069196429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 105.58823529411765, 82, 261, 86.0, 250.6, 261.0, 261.0, 0.07971826626838795, 0.02148656395515144, 0.04694347124984174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 107.0, 83, 253, 87.0, 253.0, 253.0, 253.0, 0.07768951385786703, 0.05773605473226251, 0.04362448287917338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 658.0666666666666, 82, 1153, 815.0, 1132.6, 1153.0, 1153.0, 0.08210225562263615, 49.25787899427473, 0.043563371310187796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 348.3333333333333, 83, 3006, 88.0, 1738.2000000000007, 3006.0, 3006.0, 0.07740417363304229, 9.304535997455982, 0.044618265191859144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 493.26666666666665, 84, 758, 649.0, 755.6, 758.0, 758.0, 0.08210180623973727, 16.10114771483306, 0.04364331041324576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 192.33333333333331, 83, 762, 87.0, 696.0, 762.0, 762.0, 0.07740377420803038, 3.0526516597949316, 0.04469362457363421], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 391.79999999999995, 92, 733, 436.0, 651.4000000000001, 733.0, 733.0, 0.08151775184909434, 0.016590136216163343, 0.05504040393404671], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 254.23529411764707, 171, 519, 184.0, 514.2, 519.0, 519.0, 0.07968500984344239, 0.12349620177885066, 0.17921345475532013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da1af520-36a7-427b-ba0e-7c8ab450a2d7", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 650.4347826086956, 192, 1103, 554.0, 1025.4, 1091.7999999999997, 1103.0, 0.09776251360174103, 0.06005138774950693, 0.0442031677710997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 98.40000000000002, 83, 251, 88.0, 155.60000000000005, 251.0, 251.0, 0.08217286980530508, 0.06106792375179411, 0.04124692878899103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 151.8, 83, 254, 90.0, 253.4, 254.0, 254.0, 0.08217512066046884, 0.1042703842234725, 0.04226454773552759], "isController": false}, {"data": ["login", 23, 0, 0.0, 2616.304347826087, 1634, 3841, 2558.0, 3119.6, 3696.799999999998, 3841.0, 0.09502090459901179, 39.66752398503214, 0.1981713575492043], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 93.86666666666666, 86, 110, 90.0, 108.8, 110.0, 110.0, 0.07883409627219837, 0.06382174395473872, 0.028023057659258013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2c29b72-ff27-4e85-b5b7-cc4f27fe12f3", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61f7f9e8-a4c5-4821-9577-f3876522b9ab", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 768.8, 172, 1239, 901.0, 1221.0, 1239.0, 1239.0, 0.0820622797995492, 65.49240423844836, 0.17056238819014377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2b85b38-188d-4162-888c-48acfba85dd1", 3, 0, 0.0, 323.0, 197, 472, 300.0, 472.0, 472.0, 472.0, 0.0737717011754291, 0.03337977364383023, 0.04730802451679536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e4408ad-e4b2-43a1-ae15-fc5d32ad71d5", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 249.86666666666662, 168, 365, 178.0, 353.0, 365.0, 365.0, 0.1046740450237959, 0.16222432563746494, 0.23541438055644723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 635.8571428571429, 82, 1152, 876.0, 1151.5, 1152.0, 1152.0, 0.1345597493344098, 92.0041398147881, 0.2115918268167969], "isController": false}, {"data": ["register", 25, 9, 36.0, 1027.5199999999998, 239, 2313, 919.0, 1810.4000000000005, 2213.7, 2313.0, 0.09891431646250752, 0.030817991722849998, 0.044627357622732886], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac7bee95-65d5-49ae-8835-5a089c435c17", 3, 0, 0.0, 692.6666666666667, 173, 1623, 282.0, 1623.0, 1623.0, 1623.0, 0.040243607973600194, 0.03354944011080407, 0.025807261623695434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 482.0, 168, 3092, 183.0, 1826.000000000001, 3092.0, 3092.0, 0.07736943907156672, 12.44535279658285, 0.1713662556415216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 91.07692307692307, 85, 104, 88.0, 104.0, 104.0, 104.0, 0.09834106193217493, 0.07634877366804596, 0.034957174358702804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a38d3fd-ce4d-4345-8935-eb5397c7b445", 3, 0, 0.0, 445.3333333333333, 208, 581, 547.0, 581.0, 581.0, 581.0, 0.027196823411025594, 0.02727650160461258, 0.01744067126292982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a252486-8d6d-48b4-844b-d3fc7b0e19a3", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc96b628-36fc-4a03-a7ec-5b56f800142b", 1, 0, 0.0, 1018.0, 1018, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.9823182711198427, 0.3136895260314342, 0.5861293590373281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=817706ce-618e-457f-aedd-af6f41ed211b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 393.50000000000006, 170, 978, 341.5, 840.3000000000002, 978.0, 978.0, 0.11964266723386154, 24.010223060874853, 0.26397721305700306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.0, 84, 258, 88.0, 258.0, 258.0, 258.0, 0.05203755955409593, 0.038672444160807624, 0.02612041563555206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 104.88888888888889, 82, 248, 87.0, 248.0, 248.0, 248.0, 0.052037258677212886, 0.013924032106988603, 0.029677499089347973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 120.44444444444444, 81, 252, 84.0, 252.0, 252.0, 252.0, 0.052037258677212886, 0.014025667377842535, 0.030592216527033356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 140.88888888888889, 82, 253, 86.0, 253.0, 253.0, 253.0, 0.052036957803809104, 0.014025586283057922, 0.030642856987985242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 101.33333333333333, 92, 120, 92.0, 120.0, 120.0, 120.0, 0.061971947365159374, 0.018276882914334113, 0.03830883074428309], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 956.4035087719299, 652, 1563, 908.0, 1315.6000000000001, 1409.4, 1563.0, 0.24377517940997853, 291.6398645390511, 0.4813607546552506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94fa632a-57a3-4d7e-aa01-54497c0f9f9b", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1027.5199999999998, 239, 2313, 919.0, 1810.4000000000005, 2213.7, 2313.0, 0.0980980745309931, 0.03056368134606254, 0.044259092220037904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 97.38461538461537, 82, 250, 84.0, 185.99999999999994, 250.0, 250.0, 0.059819345576359394, 0.016123182987378117, 0.035225649787641325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 97.84615384615384, 83, 243, 86.0, 181.39999999999995, 243.0, 243.0, 0.05981851981373433, 0.016122960418545582, 0.03516674699987116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6902251f-d2fe-472f-a81c-523409d3a126", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 97.46153846153845, 82, 246, 84.0, 183.99999999999994, 246.0, 246.0, 0.0895909141029882, 0.024147551066821038, 0.05266965848632704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 161.07692307692307, 82, 261, 86.0, 256.6, 261.0, 261.0, 0.08959214897106862, 0.02414788390235834, 0.0527578767866742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 84.69230769230768, 82, 88, 85.0, 87.6, 88.0, 88.0, 0.059818795065409554, 0.01600620102336154, 0.034115406560741385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 112.23076923076924, 83, 260, 86.0, 256.0, 260.0, 260.0, 0.0894885385833276, 0.06650466588077372, 0.04491905159358436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 100.38461538461537, 84, 258, 87.0, 191.99999999999994, 258.0, 258.0, 0.05981769407390706, 0.04445436053734695, 0.03002567847069163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 145.53846153846152, 83, 352, 87.0, 313.99999999999994, 352.0, 352.0, 0.08959153153277327, 0.023972734023417847, 0.05109517032728475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 107.07692307692308, 87, 255, 92.0, 200.19999999999993, 255.0, 255.0, 0.06290038514389673, 0.04950948283787184, 0.022359121281619543], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 517.4666666666667, 82, 1623, 461.0, 1111.2000000000003, 1623.0, 1623.0, 0.08081330510255208, 0.016004822533981996, 0.05499092870650224], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1324.0000000000002, 814, 1988, 1234.0, 1690.0, 1928.7999999999993, 1988.0, 0.09646639404424873, 0.04992889535493342, 0.04437077304183706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 200.53846153846158, 169, 509, 175.0, 377.7999999999999, 509.0, 509.0, 0.059794032555550956, 0.09266907193912047, 0.1344781806400721], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 992.0862068965515, 439, 3575, 757.5, 1633.2000000000005, 2312.449999999999, 3575.0, 0.2735474864287432, 85.71422939196997, 0.9941151917898023], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 141.78947368421055, 83, 356, 88.0, 339.4, 350.1, 356.0, 0.24463834298295686, 0.1818064248144826, 0.11825779275055043], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 523.8771929824561, 403, 780, 495.0, 685.8, 742.3, 780.0, 0.24453548982174653, 71.90155335002896, 0.1229841574787104], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 133.73684210526312, 83, 334, 89.0, 263.2, 264.5, 334.0, 0.24496110705230134, 0.4334663339636426, 0.11913147589067], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 813.1228070175439, 565, 1223, 811.0, 1061.4, 1122.3999999999996, 1223.0, 0.24418455211412415, 219.71768922294692, 0.12256919901040997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 101.61111111111111, 84, 272, 90.0, 131.60000000000022, 272.0, 272.0, 0.12161586951968488, 0.0908556056470302, 0.04323064111832548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 170.8381502890173, 84, 1667, 92.0, 305.5999999999998, 437.1999999999996, 1271.8399999999951, 0.7379601586827624, 1.626864062566651, 0.35327543136543954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 114.55555555555556, 86, 300, 90.0, 300.0, 300.0, 300.0, 0.05477851221560822, 0.04242125018259504, 0.019472049264141984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb9b5231-2add-4518-80b5-ce776dee1854", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 101.73333333333332, 85, 266, 89.0, 170.00000000000006, 266.0, 266.0, 0.11006266234242695, 0.08931843008452812, 0.03912383700453458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e4408ad-e4b2-43a1-ae15-fc5d32ad71d5", 3, 0, 0.0, 340.0, 217, 447, 356.0, 447.0, 447.0, 447.0, 0.03519598296514424, 0.028814419647570894, 0.022570340638455134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 269.3333333333333, 169, 513, 184.0, 513.0, 513.0, 513.0, 0.05201169685271444, 0.08060797158716582, 0.11697552524589974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 284.53846153846155, 169, 522, 181.0, 513.6, 522.0, 522.0, 0.08943620790478483, 0.1386086542430601, 0.20114412773898388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2c29b72-ff27-4e85-b5b7-cc4f27fe12f3", 3, 0, 0.0, 361.3333333333333, 278, 500, 306.0, 500.0, 500.0, 500.0, 0.025101661730006528, 0.025175201754606157, 0.01609709427347424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61f7f9e8-a4c5-4821-9577-f3876522b9ab", 3, 0, 0.0, 637.0, 246, 895, 770.0, 895.0, 895.0, 895.0, 0.06791940230925968, 0.030731760810504865, 0.0435550854652479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 99.6470588235294, 86, 257, 89.0, 128.19999999999987, 257.0, 257.0, 0.07956715467854869, 0.06596925226766391, 0.028283637014640355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a38d3fd-ce4d-4345-8935-eb5397c7b445", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 101.26666666666667, 85, 270, 89.0, 166.80000000000007, 270.0, 270.0, 0.0798756070546136, 0.06201280039884553, 0.028393282195194682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/817706ce-618e-457f-aedd-af6f41ed211b", 3, 0, 0.0, 432.3333333333333, 178, 658, 461.0, 658.0, 658.0, 658.0, 0.0321023852072209, 0.026762437667868726, 0.020586490513745174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bef4674-87da-4ae5-b9d8-a6617d4f9eff", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac7bee95-65d5-49ae-8835-5a089c435c17", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 104.55555555555554, 83, 262, 84.5, 248.50000000000003, 262.0, 262.0, 0.11985138428348847, 0.08906924164036595, 0.06015977687667292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 123.66666666666666, 82, 262, 87.0, 260.2, 262.0, 262.0, 0.1197158743249355, 0.06200128777700924, 0.06659974909548007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2b85b38-188d-4162-888c-48acfba85dd1", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 277.22222222222223, 82, 893, 248.5, 756.2000000000003, 893.0, 893.0, 0.11971667054637358, 17.980434586062984, 0.06866561637458017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 231.94444444444443, 82, 746, 90.5, 670.4000000000001, 746.0, 746.0, 0.11986016314299984, 5.900732999001165, 0.06886497003495921], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 30.0, 0.6746626686656672], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22488755622188905], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22488755622188905], "isController": false}, {"data": ["401/Unauthorized", 15, 50.0, 1.1244377811094453], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 30, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
